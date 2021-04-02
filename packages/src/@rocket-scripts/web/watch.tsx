import webpackReactConfig from '@rocket-scripts/react-preset/webpackConfig';
import { ESBuildLoaderOptions } from '@rocket-scripts/react-preset/webpackLoaders/getWebpackScriptLoaders';
import { getWebpackAlias, icuFormat, rocketTitle } from '@rocket-scripts/utils';
import {
  devServerStart,
  DevServerStartParams,
} from '@ssen/webpack-watch-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
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
import { WatchParams } from './params';
import { filterReactEnv } from './utils/filterReactEnv';
import { getAppEntry } from './utils/getAppEntry';
import { getTsConfigIncludes } from './utils/getTsConfigIncludes';
import { observeAliasChange } from './utils/observeAliasChange';
import { observeAppEntryChange } from './utils/observeAppEntryChange';

export type Watch = DevServerStartParams & {
  close: () => Promise<void>;
};

export async function watch({
  cwd = process.cwd(),
  app,
  staticFileDirectories: _staticFileDirectories = ['{cwd}/public'],
  outDir: _outDir = '{cwd}/dev/{app}',

  isolatedScripts,

  tsconfig: _tsconfig = '{cwd}/tsconfig.json',

  webpackConfig: _webpackConfig,
  esbuildLoaderOptions: _esbuildLoaderOptions,

  logfile: _logfile = tmp.fileSync({ mode: 0o644, postfix: '.log' }).name,
  stdout = process.stdout,
  stdin = process.stdin,
  children,
}: WatchParams): Promise<Watch> {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  console.log('Start Server...');

  const staticFileDirectories: string[] = _staticFileDirectories.map((dir) =>
    icuFormat(dir, { cwd, app }),
  );
  const outDir: string = icuFormat(_outDir, { cwd, app });
  const appDir: string = path.join(cwd, 'src', app);
  const logfile: string = icuFormat(_logfile, { cwd, app });
  const tsconfig: string = icuFormat(_tsconfig, { cwd, app });
  const alias = getWebpackAlias(cwd);
  const entry = getAppEntry({ appDir });
  const publicPath: string = '';
  const chunkPath: string = '';

  const userWebpackConfig: WebpackConfiguration | {} =
    typeof _webpackConfig === 'string'
      ? require(icuFormat(_webpackConfig, { cwd, app }))
      : _webpackConfig ?? {};

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

  const tsConfigIncludes: string[] = getTsConfigIncludes({
    cwd,
    entry,
    app,
    isolatedScripts,
  });

  const baseWebpackConfig: WebpackConfiguration = webpackMerge(
    userWebpackConfig,
    webpackReactConfig({
      chunkPath,
      publicPath,
      cwd,
      tsconfig,
      esbuildLoaderOptions,
      extractCss: false,
      tsConfigIncludes,
    }),
    {
      mode: 'development',
      devtool: 'source-map',

      resolve: {
        symlinks: false,
        alias,
      },

      plugins: [
        new DefinePlugin({
          'process.env': Object.keys(webpackEnv).reduce(
            (stringifiedEnv, key) => {
              stringifiedEnv[key] = JSON.stringify(webpackEnv[key]);
              return stringifiedEnv;
            },
            {} as Record<string, string>,
          ),
        }) as WebpackPluginInstance,
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

  const appWebpackConfig: WebpackConfiguration = webpackMerge(
    baseWebpackConfig,
    {
      output: {
        path: outDir,
        publicPath,
        filename: `${chunkPath}[name].js`,
        chunkFilename: `${chunkPath}[name].js`,
        pathinfo: false,
      },

      entry: entry.reduce((e, { name, index }) => {
        e[name] = path.join(cwd, 'src', app, index);
        return e;
      }, {} as Record<string, string>),

      plugins: [
        //create html files
        ...entry.map(
          ({ html, name }) =>
            new HtmlWebpackPlugin({
              template: path.join(cwd, 'src', app, html),
              filename: html,
              chunks: [name],
            }),
        ),

        new InterpolateHtmlPlugin(
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          HtmlWebpackPlugin as any,
          webpackEnv as Record<string, string>,
        ) as WebpackPluginInstance,
      ],
    },
  );

  const webpackConfigs: WebpackConfiguration[] = [appWebpackConfig];

  if (isolatedScripts) {
    const files = Object.keys(isolatedScripts);

    for (const file of files) {
      webpackConfigs.push(
        webpackMerge(baseWebpackConfig, {
          output: {
            path: outDir,
            publicPath,
            filename: `${chunkPath}[name].js`,
            chunkFilename: `${chunkPath}[name].js`,
            pathinfo: false,
          },

          entry: {
            [file]: path.join(cwd, 'src', app, isolatedScripts[file]),
          },
        }),
      );
    }
  }

  const restartAlarm: Observable<string[]> = combineLatest([
    observeAppEntryChange({ appDir, current: entry }),
    observeAliasChange({ cwd, current: alias }),
  ]).pipe(
    map<(string | null)[], string[]>((changes) =>
      changes.filter((change): change is string => !!change),
    ),
  );

  let version: string = '';

  try {
    version = '\n ' + require('@rocket-scripts/web/package.json').version;
  } catch {}

  const startParams: DevServerStartParams = {
    header: rocketTitle + version,
    webpackConfigs,
    staticFileDirectories,
    cwd,
    logfile,
    stdout,
    stdin,
    outDir,
    restartAlarm,
    children,
  };

  const close = await devServerStart(startParams);

  return {
    ...startParams,
    close,
  };
}
