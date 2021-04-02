import {
  mainWebpackConfig as webpackReactElectronMainConfig,
  rendererWebpackConfig as webpackReactElectronRendererConfig,
} from '@rocket-scripts/react-electron-preset';
import { ESBuildLoaderOptions } from '@rocket-scripts/react-preset/webpackLoaders/getWebpackScriptLoaders';
import { getWebpackAlias, icuFormat, rocketTitle } from '@rocket-scripts/utils';
import { filterReactEnv } from '@rocket-scripts/web/utils/filterReactEnv';
import { observeAliasChange } from '@rocket-scripts/web/utils/observeAliasChange';
import {
  devServerStart,
  DevServerStartParams,
} from '@ssen/electron-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import tmp from 'tmp';
import {
  Configuration as WebpackConfiguration,
  DefinePlugin,
  WebpackPluginInstance,
} from 'webpack';
import { merge as webpackMerge } from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import { StartParams } from './params';
import { getMainTsConfigIncludes } from './utils/getMainTsConfigIncludes';
import { getRendererTsConfigIncludes } from './utils/getRendererTsConfigIncludes';

export interface Start extends DevServerStartParams {
  close: () => Promise<void>;
}

export async function start({
  cwd = process.cwd(),
  app,
  staticFileDirectories: _staticFileDirectories = ['{cwd}/public'],
  outDir: _outDir = '{cwd}/dev/{app}',

  electronSwitches = {},
  tsconfig: _tsconfig = '{cwd}/tsconfig.json',

  mainWebpackConfig: _mainWebpackConfig,
  rendererWebpackConfig: _rendererWebpackConfig,
  esbuildLoaderOptions: _esbuildLoaderOptions,

  logfile: _logfile = tmp.fileSync({ mode: 0o644, postfix: '.log' }).name,
  stdout = process.stdout,
  stdin = process.stdin,
  children,
}: StartParams): Promise<Start> {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  console.log('Start Server...');

  const staticFileDirectories: string[] = _staticFileDirectories.map((dir) =>
    icuFormat(dir, { cwd, app }),
  );
  const outDir: string = icuFormat(_outDir, { cwd, app });
  const tsconfig: string = icuFormat(_tsconfig, { cwd, app });
  const alias = getWebpackAlias(cwd);
  const logfile: string = icuFormat(_logfile, { cwd, app });
  const publicPath: string = '';
  const chunkPath: string = '';

  const userMainWebpackConfig: WebpackConfiguration | {} =
    typeof _mainWebpackConfig === 'string'
      ? require(icuFormat(_mainWebpackConfig, { cwd, app }))
      : _mainWebpackConfig ?? {};

  const userRendererWebpackConfig: WebpackConfiguration | {} =
    typeof _rendererWebpackConfig === 'string'
      ? require(icuFormat(_rendererWebpackConfig, { cwd, app }))
      : _rendererWebpackConfig ?? {};

  const webpackEnv: NodeJS.ProcessEnv = {
    ...filterReactEnv(process.env),
    PUBLIC_PATH: publicPath,
    PUBLIC_URL: publicPath,
    NODE_ENV: process.env.NODE_ENV,
  };

  const esbuildLoaderOptions: ESBuildLoaderOptions = {
    target: 'es2016',
    loader: 'tsx',
    tsconfigRaw: {},
    ..._esbuildLoaderOptions,
  };

  const mainWebpackConfig: WebpackConfiguration = webpackMerge(
    userMainWebpackConfig,
    webpackReactElectronMainConfig({
      cwd,
      esbuildLoaderOptions,
      tsconfig,
      tsConfigIncludes: getMainTsConfigIncludes({ cwd, app }),
    }),
    {
      mode: 'development',
      devtool: 'source-map',

      output: {
        path: outDir,
        filename: `[name].js`,
        chunkFilename: `[name].js`,
        pathinfo: false,
      },

      resolve: {
        symlinks: false,
        alias,
      },

      entry: {
        main: path.join(cwd, `src/${app}/main`),
        preload: path.join(cwd, `src/${app}/preload`),
      },

      externals: [
        nodeExternals({
          allowlist: [
            // include asset files
            /\.(?!(?:jsx?|json)$).{1,5}$/i,
          ],
        }),
      ],

      plugins: [
        new DefinePlugin({
          'process.env': Object.keys(webpackEnv).reduce(
            (stringifiedEnv, key) => {
              stringifiedEnv[key] = JSON.stringify(webpackEnv[key]);
              return stringifiedEnv;
            },
            {} as Record<string, string>,
          ),
        }),
      ],

      performance: {
        hints: false,
      },

      optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,

        moduleIds: 'named',
        emitOnErrors: false,
      },
    },
  );

  const rendererWebpackConfig: WebpackConfiguration = webpackMerge(
    userRendererWebpackConfig,
    webpackReactElectronRendererConfig({
      cwd,
      tsconfig,
      esbuildLoaderOptions,
      chunkPath,
      publicPath,
      extractCss: true,
      tsConfigIncludes: getRendererTsConfigIncludes({ cwd, app }),
    }),
    {
      mode: 'development',
      devtool: 'source-map',

      output: {
        path: outDir,
        filename: `[name].js`,
        chunkFilename: `[name].js`,
        pathinfo: false,
      },

      resolve: {
        symlinks: false,
        alias,
      },

      entry: {
        renderer: path.join(cwd, `src/${app}/renderer`),
      },

      plugins: [
        new MiniCssExtractPlugin({
          filename: `[name].css`,
        }) as WebpackPluginInstance,

        new HtmlWebpackPlugin({
          template: path.join(cwd, `src/${app}/index.html`),
          filename: 'index.html',
        }),

        new InterpolateHtmlPlugin(
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          HtmlWebpackPlugin as any,
          webpackEnv as Record<string, string>,
        ) as WebpackPluginInstance,

        new DefinePlugin({
          'process.env': Object.keys(webpackEnv).reduce(
            (stringifiedEnv, key) => {
              stringifiedEnv[key] = JSON.stringify(webpackEnv[key]);
              return stringifiedEnv;
            },
            {} as Record<string, string>,
          ),
        }),
      ],

      performance: {
        hints: false,
      },

      optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,

        moduleIds: 'named',
        emitOnErrors: false,
      },
    },
  );

  const restartAlarm: Observable<string[]> = combineLatest([
    observeAliasChange({ cwd, current: alias }),
  ]).pipe(
    map<(string | null)[], string[]>((changes) =>
      changes.filter((change): change is string => !!change),
    ),
  );

  let version: string = '';

  try {
    version = '\n ' + require('@rocket-scripts/electron/package.json').version;
  } catch {}

  const startParams: DevServerStartParams = {
    header: rocketTitle + version,
    cwd,
    outDir,
    staticFileDirectories,
    mainWebpackConfig,
    rendererWebpackConfig,
    electronSwitches,
    stdin,
    stdout,
    restartAlarm,
    logfile,
    children,
  };

  const close = await devServerStart(startParams);

  return {
    ...startParams,
    close,
  };
}
