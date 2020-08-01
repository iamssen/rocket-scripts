import { getBrowserslistQuery } from '@rocket-scripts/browserslist';
import { webpackConfig as webpackReactConfig } from '@rocket-scripts/react-preset';
import { getWebpackAlias, icuFormat, rocketTitle } from '@rocket-scripts/utils';
import { observeAliasChange } from '@rocket-scripts/web/utils/observeAliasChange';
import { devServerStart, DevServerStartParams } from '@ssen/webpack-dev-server';
import getPort from 'get-port';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import https from 'https';
import path from 'path';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Configuration as WebpackConfiguration, DefinePlugin, HotModuleReplacementPlugin } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { merge as webpackMerge } from 'webpack-merge';
import { getAppEntry } from './utils/getAppEntry';
import { getProxyConfig } from './utils/getProxyConfig';
import { observeAppEntryChange } from './utils/observeAppEntryChange';
import { observeProxyConfigChange } from './utils/observeProxyConfigChange';

export interface StartParams
  extends Omit<DevServerStartParams, 'port' | 'hostname' | 'devServerConfig' | 'webpackConfig'> {
  // cli
  app: string;
  port?: 'random' | number;
  hostname?: string;
  https?: boolean | https.ServerOptions;
  tsconfig?: string;
  staticFileDirectories?: string[];
  webpackConfig?: string | WebpackConfiguration;

  // api
  cwd: string;
  env?: NodeJS.ProcessEnv;
  stdout?: NodeJS.WriteStream;
  stdin?: NodeJS.ReadStream;
}

export interface Start extends DevServerStartParams {
  close: () => Promise<void>;
}

export async function start({
  cwd,
  app,
  port: _port = 'random',
  hostname = 'localhost',
  staticFileDirectories: _staticFileDirectories = ['{cwd}/public'],
  https,
  env = {},
  tsconfig: _tsconfig = '{cwd}/tsconfig.json',
  stdout = process.stdout,
  stdin = process.stdin,
  logfile,
  webpackConfig: _webpackConfig,
}: StartParams): Promise<Start> {
  console.log('Start Server...');
  const port: number =
    typeof _port === 'number' ? _port : await getPort({ port: getPort.makeRange(8000, 9999) });
  const staticFileDirectories: string[] = _staticFileDirectories.map((dir) => icuFormat(dir, { cwd, app }));
  const appDir: string = path.join(cwd, 'src', app);
  const tsconfig: string = icuFormat(_tsconfig, { cwd, app });
  const alias = getWebpackAlias(cwd);
  const entry = getAppEntry({ appDir });
  const publicPath: string = '';
  const chunkPath: string = '';

  const userWebpackConfig: WebpackConfiguration | {} =
    typeof _webpackConfig === 'string'
      ? require(icuFormat(_webpackConfig, { cwd, app }))
      : _webpackConfig ?? {};

  const reactAppEnv: NodeJS.ProcessEnv = Object.keys(env)
    .filter((key) => /^REACT_APP_/i.test(key))
    .reduce((e, key) => {
      e[key] = env[key];
      return e;
    }, {});

  const webpackEnv = {
    ...reactAppEnv,
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
    },
  );

  const proxyConfig = getProxyConfig(cwd);

  const devServerConfig: WebpackDevServerConfiguration = {
    hot: true,
    compress: true,
    contentBase: staticFileDirectories,
    stats: {
      colors: false,
    },
    proxy: proxyConfig,
    https,
  };

  const restartAlarm: Observable<string[]> = combineLatest([
    observeAppEntryChange({ appDir, current: entry }),
    observeAliasChange({ cwd, current: alias }),
    observeProxyConfigChange({ cwd, current: proxyConfig }),
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
