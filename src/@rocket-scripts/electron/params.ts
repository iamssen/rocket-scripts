import { ElectronSwitchesYargsValues } from '@ssen/electron-switches';
import { Configuration as WebpackConfiguration } from 'webpack';

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
   * custom webpack configuration to main and preload process
   *
   * but, this value will be used with the lowest priority.
   *
   * this value useful to set the miscellaneous options.
   *
   * @example { webpackConfig: '{cwd}/webpack.main.config.js' }
   *
   * @example { webpackConfig: { externals : { ... } } }
   */
  mainWebpackConfig?:
    | string
    | Omit<
        WebpackConfiguration,
        // @rocket-scripts/react-preset
        | 'resolve'
        | 'module'
        | 'plugin'
        | 'resolveLoader'
        | 'node'
        // @rocket-scripts/web
        | 'mode'
        | 'devtool'
        | 'output'
        | 'entry'
        | 'externals' // main process will make every packages to be external
        | 'performance'
        | 'optimization'
      >;

  /**
   * custom webpack configuration to renderer process
   *
   * but, this value will be used with the lowest priority.
   *
   * this value useful to set the miscellaneous options.
   *
   * @example { webpackConfig: '{cwd}/webpack.renderer.config.js' }
   *
   * @example { webpackConfig: { externals : { ... } } }
   */
  rendererWebpackConfig?:
    | string
    | Omit<
        WebpackConfiguration,
        // @rocket-scripts/react-preset
        | 'resolve'
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
   * tsconfig path. (it will pass to fork-ts-checker-webpack-plugin)
   *
   * @example { tsconfig: '{cwd}/tsconfig.dev.json' }
   *
   * @default {cwd}/tsconfig.json
   */
  tsconfig?: string;
}

export interface StartParams extends CommonParams {
  /**
   * output directory.
   *
   * @example { outDir: '{cwd}/dist/{app}' }
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

  electronSwitches?: ElectronSwitchesYargsValues;

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
}
