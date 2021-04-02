import webpackReactConfig from '@rocket-scripts/react-preset/webpackConfig';
import { ESBuildLoaderOptions } from '@rocket-scripts/react-preset/webpackLoaders/getWebpackScriptLoaders';
import { getWebpackAlias, icuFormat, rocketTitle } from '@rocket-scripts/utils';
import { devServerStart, DevServerStartParams } from '@ssen/webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { getPortPromise } from 'portfinder';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import tmp from 'tmp';
import {
  Configuration as WebpackConfiguration,
  DefinePlugin,
  HotModuleReplacementPlugin,
  WebpackPluginInstance,
} from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { merge as webpackMerge } from 'webpack-merge';
import { StartParams } from './params';
import { filterReactEnv } from './utils/filterReactEnv';
import { getAppEntry } from './utils/getAppEntry';
import { getTsConfigIncludes } from './utils/getTsConfigIncludes';
import { observeAliasChange } from './utils/observeAliasChange';
import { observeAppEntryChange } from './utils/observeAppEntryChange';

export type Start = DevServerStartParams & {
  close: () => Promise<void>;
};

export async function start({
  cwd = process.cwd(),
  app,
  staticFileDirectories: _staticFileDirectories = ['{cwd}/public'],

  isolatedScripts,

  tsconfig: _tsconfig = '{cwd}/tsconfig.json',

  port: _port = 'random',
  hostname = 'localhost',

  webpackConfig: _webpackConfig,
  webpackDevServerConfig: _webpackDevServerConfig,
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

  const port: number =
    typeof _port === 'number' ? _port : await getPortPromise();
  const staticFileDirectories: string[] = _staticFileDirectories.map((dir) =>
    icuFormat(dir, { cwd, app }),
  );
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

  const userWebpackDevServerConfig: WebpackDevServerConfiguration | {} =
    typeof _webpackDevServerConfig === 'string'
      ? require(icuFormat(_webpackDevServerConfig, { cwd, app }))
      : _webpackDevServerConfig ?? {};

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
      devtool: 'eval-cheap-module-source-map',

      resolve: {
        symlinks: false,
        alias,
      },

      plugins: [
        new HotModuleReplacementPlugin(),

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
        path: cwd,
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
            path: cwd,
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

  const devServerConfig: WebpackDevServerConfiguration = {
    ...userWebpackDevServerConfig,
    hot: true,
    compress: true,
    //@ts-ignore TODO update typescript declaration webpack-dev-server 4.x
    static: staticFileDirectories,
    historyApiFallback: true,
  };

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
    hostname,
    webpackConfigs,
    devServerConfig,
    port,
    cwd,
    logfile,
    stdout,
    stdin,
    restartAlarm,
    children,
  };

  const close = await devServerStart(startParams);

  return {
    ...startParams,
    close,
  };
}
