import { getBrowserslistQuery } from '@rocket-scripts/browserslist';
import { webpackConfig as webpackReactConfig } from '@rocket-scripts/react-preset';
import { getWebpackAlias, icuFormat, rocketTitle } from '@rocket-scripts/utils';
import { devServerStart, DevServerStartParams } from '@ssen/webpack-dev-server';
import getPort from 'get-port';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import https from 'https';
import path from 'path';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import tmp from 'tmp';
import { Configuration as WebpackConfiguration, DefinePlugin, HotModuleReplacementPlugin } from 'webpack';
import {
  Configuration as WebpackDevServerConfiguration,
  ProxyConfigArray,
  ProxyConfigMap,
} from 'webpack-dev-server';
import { merge as webpackMerge } from 'webpack-merge';
import { filterReactEnv } from './utils/filterReactEnv';
import { getAppEntry } from './utils/getAppEntry';
import { observeAliasChange } from './utils/observeAliasChange';
import { observeAppEntryChange } from './utils/observeAppEntryChange';

export interface StartParams {
  /**
   * if you run from outside of project root.
   *
   * you have to set this value to your project root.
   *
   * e.g. `cwd: path.join(__dirname, 'my-project)`
   *
   * default. `process.cwd()`
   */
  cwd?: string;

  /**
   * app directory you want to run
   *
   * e.g. `app: 'app'` mean run `src/app` directory
   *
   * warn. do not set over 2-depth directory path (e.g. `app: 'group/app'`)
   *       it just support top level directory only.
   */
  app: string;

  /**
   * set static file directories.
   *
   * you can set with this when you want to use the other static file directories instead of `{project}/public`.
   *
   * e.g. `staticFileDirectories: ['{cwd}/static', '{cwd}/public']
   *
   * default. `['{cwd}/public']`
   *
   * tip. you can use `{cwd}` and `{app}`. they are same values that you are input.
   */
  staticFileDirectories?: string[];

  /**
   * set env.
   *
   * you can set with this when you want to use another env values instead of `process.env`.
   *
   * e.g. `env: { ...process.env, REACT_APP_ENDPOINT: 'http://server.com:3485' }`
   *
   * default. `process.env`
   */
  env?: NodeJS.ProcessEnv;

  stdout?: NodeJS.WriteStream;
  stdin?: NodeJS.ReadStream;
  logfile?: string;

  webpackConfig?: string | WebpackConfiguration;

  port?: 'random' | number;
  hostname?: string;
  https?: boolean | https.ServerOptions;
  proxy?: ProxyConfigMap | ProxyConfigArray;
  webpackDevServerConfig?: string | WebpackDevServerConfiguration;

  tsconfig?: string;
}

export interface Start extends DevServerStartParams {
  close: () => Promise<void>;
}

export async function start({
  cwd = process.cwd(),
  app,
  port: _port = 'random',
  hostname = 'localhost',
  staticFileDirectories: _staticFileDirectories = ['{cwd}/public'],
  https,
  env = process.env,
  tsconfig: _tsconfig = '{cwd}/tsconfig.json',
  stdout = process.stdout,
  stdin = process.stdin,
  logfile: _logfile = tmp.fileSync({ mode: 0o644, postfix: '.log' }).name,
  webpackConfig: _webpackConfig,
  webpackDevServerConfig: _webpackDevServerConfig,
  proxy,
}: StartParams): Promise<Start> {
  console.log('Start Server...');

  const port: number =
    typeof _port === 'number' ? _port : await getPort({ port: getPort.makeRange(8000, 9999) });
  const staticFileDirectories: string[] = _staticFileDirectories.map((dir) => icuFormat(dir, { cwd, app }));
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

  const webpackEnv = {
    ...filterReactEnv(env),
    PUBLIC_PATH: publicPath,
    PUBLIC_URL: publicPath,
    NODE_ENV: env['NODE_ENV'] || 'development',
  };

  const babelLoaderOptions: object = {
    presets: [
      [
        require.resolve('@rocket-scripts/react-preset/babelPreset'),
        {
          modules: false,
          targets: getBrowserslistQuery({ cwd }),
        },
      ],
    ],
  };

  const webpackConfig: WebpackConfiguration = webpackMerge(
    userWebpackConfig,
    webpackReactConfig({
      chunkPath,
      publicPath,
      cwd,
      tsconfig,
      babelLoaderOptions,
      extractCss: false,
    }),
    {
      mode: 'development',
      devtool: 'cheap-module-eval-source-map',

      output: {
        path: cwd,
        publicPath,
        filename: `${chunkPath}[name].js`,
        chunkFilename: `${chunkPath}[name].js`,
        pathinfo: false,
      },

      resolve: {
        symlinks: false,
        alias,
      },

      entry: entry.reduce((e, { name, index }) => {
        e[name] = path.join(cwd, 'src', app, index);
        return e;
      }, {}),

      plugins: [
        new HotModuleReplacementPlugin(),

        //create html files
        ...entry.map(
          ({ html }) =>
            new HtmlWebpackPlugin({
              template: path.join(cwd, 'src', app, html),
              filename: html,
            }),
        ),

        new InterpolateHtmlPlugin(HtmlWebpackPlugin, webpackEnv),

        new DefinePlugin({
          'process.env': Object.keys(webpackEnv).reduce((stringifiedEnv, key) => {
            stringifiedEnv[key] = JSON.stringify(webpackEnv[key]);
            return stringifiedEnv;
          }, {}),
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
        noEmitOnErrors: true,
      },
    },
  );

  const devServerConfig: WebpackDevServerConfiguration = {
    ...userWebpackDevServerConfig,
    hot: true,
    compress: true,
    contentBase: staticFileDirectories,
    stats: {
      colors: false,
    },
    proxy,
    https,
  };

  const restartAlarm: Observable<string[]> = combineLatest([
    observeAppEntryChange({ appDir, current: entry }),
    observeAliasChange({ cwd, current: alias }),
  ]).pipe(
    map<(string | null)[], string[]>((changes) => changes.filter((change): change is string => !!change)),
  );

  let version: string = '';

  try {
    version = '\n ' + require('@rocket-scripts/web/package.json').version;
  } catch {}

  const startParams: DevServerStartParams = {
    header: rocketTitle + version,
    hostname,
    webpackConfig,
    devServerConfig,
    port,
    cwd,
    logfile,
    stdout,
    stdin,
    restartAlarm,
  };

  const close = await devServerStart(startParams);

  return {
    ...startParams,
    close,
  };
}
