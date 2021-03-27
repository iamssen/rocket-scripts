import { ReactNode } from 'react';
import { Configuration as WebpackConfiguration } from 'webpack';
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
   * add script builds that is out of main app context
   *
   * e.g. when you configure like `{ script: 'script.ts' }`
   *
   * it will create `script.js`
   *
   * and, the `script.js` is did not split by webpack split chunks
   *
   * @example { script: 'script.ts' }
   */
  isolatedScripts?: Record<string, string>;

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
   * @deprecated do not use this env option. use instead `process.env.VAR = 'value'` before run.
   *
   * @example
   *
   * // remove this like code
   * start({
   *  env: { REACT_APP_HELLO: 'value' }
   * })
   *
   * // use instead of this
   * process.env.REACT_APP_HELLO = 'value'
   *
   * start({})
   */
  env?: NodeJS.ProcessEnv;

  /**
   * ⚠️ tsconfig path. (it will pass to fork-ts-checker-webpack-plugin)
   *
   * @example { tsconfig: '{cwd}/tsconfig.dev.json' }
   *
   * @default {cwd}/tsconfig.json
   */
  tsconfig?: string;

  /**
   * ⚠️ custom webpack configuration
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
   * ⚠️ replace babel-loader options
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
   * ⚠️ custom webpack-dev-server configuration
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
   * ⚠️ ink stdout
   *
   * @default process.stdout
   */
  stdout?: NodeJS.WriteStream;

  /**
   * ⚠️ ink stdin
   *
   * @default process.stdin
   */
  stdin?: NodeJS.ReadStream;

  /**
   * ⚠️ attach ui elements
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
   * @see https://webpack.js.org/configuration/devtool/#devtool
   *
   * @default source-map
   */
  devtool?:
    | false
    | 'eval'
    | 'eval-cheap-source-map'
    | 'eval-cheap-module-source-map'
    | 'eval-source-map'
    | 'eval-nosources-source-map'
    | 'eval-nosources-cheap-source-map'
    | 'eval-nosources-cheap-module-source-map'
    | 'cheap-source-map'
    | 'cheap-module-source-map'
    | 'inline-cheap-source-map'
    | 'inline-cheap-module-source-map'
    | 'inline-source-map'
    | 'inline-nosources-source-map'
    | 'inline-nosources-cheap-source-map'
    | 'inline-nosources-cheap-module-source-map'
    | 'source-map'
    | 'hidden-source-map'
    | 'hidden-nosources-source-map'
    | 'hidden-nosources-cheap-source-map'
    | 'hidden-nosources-cheap-module-source-map'
    | 'hidden-cheap-source-map'
    | 'hidden-cheap-module-source-map'
    | 'nosources-source-map'
    | 'nosources-cheap-source-map'
    | 'nosources-cheap-module-source-map';

  /**
   * if you want to open bundle size report on your web browser after build set `true` this option.
   *
   * this option is just opening `{outDir}/size-report.html` file.
   *
   * `{outDir}/size-report.html` file always be made.
   *
   * @default false
   */
  openBundleSizeReport?: boolean;
}

export interface WatchParams extends CommonParams {
  /**
   * output directory.
   *
   * @example { outDir: '{cwd}/dev/{app}' }
   *
   * @default {cwd}/dev/{app}
   */
  outDir?: string;

  /**
   * logfile path.
   *
   * @example { logfile: '{cwd}/log.txt' }
   *
   * @default (if this value is undefined it will be new temporary file)
   */
  logfile?: string;

  /**
   * ⚠️ ink stdout
   *
   * @default process.stdout
   */
  stdout?: NodeJS.WriteStream;

  /**
   * ⚠️ ink stdin
   *
   * @default process.stdin
   */
  stdin?: NodeJS.ReadStream;

  /**
   * ⚠️ attach ui elements
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
