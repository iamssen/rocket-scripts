import { getBrowserslistQuery } from '@rocket-scripts/browserslist';
import { webpackConfig as webpackReactConfig } from '@rocket-scripts/react-preset';
import { getWebpackAlias, icuFormat, rocketTitle } from '@rocket-scripts/utils';
import { devServerStart, DevServerStartParams } from '@ssen/webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { getPortPromise } from 'portfinder';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import tmp from 'tmp';
import { Configuration as WebpackConfiguration, DefinePlugin, HotModuleReplacementPlugin } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { merge as webpackMerge } from 'webpack-merge';
import { StartParams } from './params';
import { filterReactEnv } from './utils/filterReactEnv';
import { getAppEntry } from './utils/getAppEntry';
import { observeAliasChange } from './utils/observeAliasChange';
import { observeAppEntryChange } from './utils/observeAppEntryChange';

export interface Start extends DevServerStartParams {
  close: () => Promise<void>;
}

export async function start({
  cwd = process.cwd(),
  app,
  staticFileDirectories: _staticFileDirectories = ['{cwd}/public'],

  env = process.env,
  tsconfig: _tsconfig = '{cwd}/tsconfig.json',

  port: _port = 'random',
  hostname = 'localhost',

  webpackConfig: _webpackConfig,
  webpackDevServerConfig: _webpackDevServerConfig,
  babelLoaderOptions: _babelLoaderOptions,

  logfile: _logfile = tmp.fileSync({ mode: 0o644, postfix: '.log' }).name,
  stdout = process.stdout,
  stdin = process.stdin,
  children,
}: StartParams): Promise<Start> {
  console.log('Start Server...');

  const port: number = typeof _port === 'number' ? _port : await getPortPromise();
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

  const babelLoaderOptions: object = _babelLoaderOptions ?? {
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
    children,
  };

  const close = await devServerStart(startParams);

  return {
    ...startParams,
    close,
  };
}
