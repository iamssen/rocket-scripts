import { getBrowserslistQuery } from '@rocket-scripts/browserslist';
import { webpackConfig as webpackReactConfig } from '@rocket-scripts/react-preset';
import { getWebpackAlias, icuFormat } from '@rocket-scripts/utils';
import { devServerStart, DevServerStartParams } from '@rocket-scripts/web-dev-server';
import getPort from 'get-port';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import { Configuration as WebpackConfiguration, DefinePlugin } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { merge as webpackMerge } from 'webpack-merge';
import { rocketTitle } from './components/rocketTitle';
import { getAppEntry } from './rules/getAppEntry';
import { getProxyConfig } from './rules/getProxyConfig';

export interface StartPrams
  extends Omit<DevServerStartParams, 'port' | 'hostname' | 'devServerConfig' | 'webpackConfig'> {
  // cli
  app: string;
  port?: 'random' | number;
  https?: boolean | { key: string; cert: string };

  // api
  hostname?: string;
  cwd: string;
  staticFileDirectories?: string[];
  externals?: string[];
  env?: NodeJS.ProcessEnv;
  tsconfig?: string;
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
  externals = [],
  https = false,
  env = {},
  tsconfig: _tsconfig = '{cwd}/tsconfig.json',
  stdout = process.stdout,
  stdin = process.stdin,
  logfile,
}: StartPrams): Promise<Start> {
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
  };

  const startParams: DevServerStartParams = {
    header: rocketTitle,
    hostname,
    webpackConfig,
    devServerConfig,
    port,
    cwd,
    logfile,
    stdout,
    stdin,
  };

  const close = await devServerStart(startParams);

  return {
    ...startParams,
    close,
  };
}
