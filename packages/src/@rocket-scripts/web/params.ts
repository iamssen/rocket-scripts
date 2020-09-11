import { ReactNode } from 'react';
import {
  Configuration as WebpackConfiguration,
  Options as WebpackOptions,
} from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

export interface CommonParams {
  /**
   * if you run from outside of project root.
   *
   * you have to set this value to your project root.
   *
   * @example { cwd: path.join(__dirname, 'my-project) }
   *
   * @default process.cwd()
   */
  cwd?: string;

  /**
   * app directory you want to run
   *
   * e.g. `app: 'app'` mean run `/src/app` directory
   *
   * warn. do not set over 2-depth directory path (e.g. `app: 'group/app'`)
   *       it just support top level directory only.
   *
   * @example { app: 'app' }
   */
  app: string;

  /**
   * set static file directories.
   *
   * you can set with this when you want to use the other static file directories instead of `{project}/public`.
   *
   * tip. you can use `{cwd}` and `{app}`. they are same values that you are input.
   *
   * @example { staticFileDirectories: ['{cwd}/static', '{cwd}/public'] }
   *
   * @default ['{cwd}/public']
   */
  staticFileDirectories?: string[];

  /**
   * set env.
   *
   * you can set with this when you want to use another env values instead of `process.env`.
   *
   * @example { env: { ...process.env, REACT_APP_ENDPOINT: 'http://server.com:3485' } }
   *
   * @default process.env
   */
  env?: NodeJS.ProcessEnv;

  /**
   * tsconfig path. (it will pass to fork-ts-checker-webpack-plugin)
   *
   * @example { tsconfig: '{cwd}/tsconfig.dev.json' }
   *
   * @default {cwd}/tsconfig.json
   */
  tsconfig?: string;

  /**
   * custom webpack configuration
   *
   * but, this value will be used with the lowest priority.
   *
   * this value useful to set the miscellaneous options like the "externals".
   *
   * @example { webpackConfig: '{cwd}/webpack.config.js' }
   *
   * @example { webpackConfig: { externals : { ... } } }
   */
  webpackConfig?:
    | string
    | Omit<
        WebpackConfiguration,
        // @rocket-scripts/react-preset
        | 'module'
        | 'plugin'
        | 'resolveLoader'
        | 'node'
        // @rocket-scripts/web
        | 'mode'
        | 'devtool'
        | 'output'
        | 'entry'
        | 'performance'
        | 'optimization'
      >;

  /**
   * replace babel-loader options
   *
   * you can replace babel-loader options
   *
   * warn. but, this option can break rocket-scripts work
   *
   * @example
   * {
   *   // use rocket-scripts default preset
   *   // this is safe because this just add some configs on default config.
   *   presets: [
   *     [
   *       require.resolve('(at)rocket-scripts/react-preset/babelPreset'),
   *       {
   *         modules: false,
   *         targets: getBrowserslistQuery({ cwd }),
   *       },
   *     ],
   *   ],
   *   // add your own config
   *   plugins: [
   *     require.resolve('babel-some-plugin'),
   *   ],
   * }
   *
   * @example
   * {
   *   // this is not safe
   *   // when using a babel-loader option to overwrite everything,
   *   // rocket-scripts may not work properly.
   *   presets: [
   *     require.resolve('babel-some-preset'),
   *   ],
   *   plugins: [
   *     require.resolve('babel-some-plugin'),
   *   ]
   * }
   *
   * @default
   * {
   *   presets: [
   *     [
   *       require.resolve('(at)rocket-scripts/react-preset/babelPreset'),
   *       {
   *         modules: false,
   *         targets: getBrowserslistQuery({ cwd }),
   *       },
   *     ],
   *   ],
   * }
   */
  babelLoaderOptions?: object;
}

export interface StartParams extends CommonParams {
  /**
   * dev server port. (it will pass to port option of webpack-dev-server)
   *
   * if you unset this value the server will run with a random port.
   *
   * @example { port: 9044 }
   *
   * @default random
   */
  port?: 'random' | number;

  /**
   * dev server hostname. (it will pass to hostname option of webpack-dev-server)
   *
   * @example { hostname: '127.0.0.1' }
   *
   * @default localhost
   */
  hostname?: string;

  /**
   * custom webpack-dev-server configuration
   *
   * but, this value will be used with the lowest priority.
   *
   * also, `staticFileDirectories` options will be override this.
   *
   * so just use to set the miscellaneous options.
   *
   * @example { webpackDevServerConfig: '{cwd}/devServer.js' }
   *
   * @example { webpackDevServerConfig: { https: true } }
   */
  webpackDevServerConfig?:
    | string
    | Omit<
        WebpackDevServerConfiguration,
        'hot' | 'compress' | 'contentBase' | 'stats'
      >;

  /**
   * logfile path.
   *
   * @example { logfile: '{cwd}/log.txt' }
   *
   * @default (if this value is undefined it will be new temporary file)
   */
  logfile?: string;

  /**
   * [advanced] ink stdout
   *
   * @default process.stdout
   */
  stdout?: NodeJS.WriteStream;

  /**
   * [advanced] ink stdin
   *
   * @default process.stdin
   */
  stdin?: NodeJS.ReadStream;

  /**
   * [advanced] attach ui elements
   *
   * This elements will attach the end of UI
   *
   * @example
   * {
   *   children: (
   *     <>
   *       <Custom1/>
   *       <Custom2/>
   *     </>
   *   )
   * }
   */
  children?: ReactNode;
}

export interface BuildParams extends CommonParams {
  /**
   * output directory.
   *
   * @example { outDir: '{cwd}/dist/{app}' }
   *
   * @default {cwd}/out/{app}
   */
  outDir?: string;

  /**
   * this value will pass to `devtool` option of webpackConfig.
   *
   * @example { devtool: false }
   *
   * @default source-map
   */
  devtool?: WebpackOptions.Devtool;
}
