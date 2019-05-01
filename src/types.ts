import { Configuration } from 'webpack';

// ---------------------------------------------
//
// ---------------------------------------------
export interface PackageArgv {
  command: 'build' | 'publish';
}

export interface WebappArgv {
  // common
  command: 'build' | 'start';
  app: string;
  
  // --static-file-directories public,static
  // --static-file-packages xxx,yyy
  staticFileDirectories: string | undefined;
  staticFilePackages: string | undefined;
  
  // build
  // --size-report
  // --compress
  // --output /path/to
  // --vendor-file-name vendor
  // --style-file-name style
  // --build-path lib
  sizeReport: boolean;
  compress: boolean;
  output: string | undefined;
  vendorFileName: string;
  styleFileName: string;
  chunkPath: string;
  
  // start
  // --port 3100
  // --server-port 4100
  // --https
  // --https-key path-to-custom.key --https-cert path-to-custom.crt
  port: number;
  serverPort: number;
  https: boolean | {key: string, cert: string};
}

export interface WebappConfig {
  command: 'build' | 'start';
  app: string;
  
  // build
  staticFileDirectories: string[];
  
  sizeReport: boolean;
  compress: boolean;
  output: string;
  vendorFileName: string;
  styleFileName: string;
  chunkPath: string;
  
  // start
  port: number;
  serverPort: number;
  https: boolean | {key: string, cert: string};
  
  // internal
  cwd: string;
  zeroconfigPath: string;
  serverEnabled: boolean;
}

// ---------------------------------------------
// config
// ---------------------------------------------
export interface Config {
  app: {
    /** client entry files from `_app/*` */
    entry: string[];
    /** browser sync test web server port. default is '3100' */
    port: number;
    /** static file directories (ex. `{static file directory}/test.png` to `{build root}/test.png`) */
    staticFileDirectories: string[];
    
    /** js, css and other build files directory (ex. set `buildPath` to `build/path` then js file will be made to `{build root}/build/path/*.js` */
    buildPath: string;
    /** browser sync test web server https */
    https: boolean | {key: string, cert: string};
    /** vendor file name. default is 'vendor' (vender is chunk group of `/node_modules/*`) */
    vendorFileName: string;
    /** style file name. default is 'style' (style is chunk group of all css styles) */
    styleFileName: string;
    /** webpack public path. default is '' */
    publicPath: string;
    /** server side rendering express server port. default is '4100' (it will be proxied on browser sync) */
    serverPort: number;
  };
  
  modules: {
    /** module entry files from `_modules/** /*` */
    entry: string[];
  }
  
  /** [set by zeroconfig] command name (ex. `web.build`) */
  command: string;
  /** [set by zeroconfig] application directory */
  appDirectory: string;
  /** [set by zeroconfig] zeroconfig module directory (ex. `~/node_modules/react-zeroconfig`) */
  zeroconfigDirectory: string;
  /** [set by zeroconfig] server side rendering enabled (when `/_server` directory is exists) */
  serverEnabled: boolean;
  /** [set by zeroconfig] use typescript (when `/src/** /*.tsx?` are exists) */
  typescriptEnabled: boolean;
}

export type UserConfig = Partial<Config>;

// ---------------------------------------------
// module
// ---------------------------------------------
export interface ModuleBuildOption {
  /** module name is package.json name */
  name: string;
  /** absolute file location */
  file: string;
  /** build typescript declarations */
  declaration: boolean;
  /** external libraries */
  externals: string[];
}

export interface ModulePublishOption {
  /** module name is package.json name */
  name: string;
  /** current package.json version */
  workingVersion: string;
  /** latest remote version */
  remoteVersion: string | undefined;
}

// ---------------------------------------------
// webpack
// ---------------------------------------------
export type WebpackFunction = (config: Config) => Promise<Configuration>;

// ---------------------------------------------
// translation
// ---------------------------------------------
export type TranslationType = 'i18next' | 'intl';
export type TranslationNode = string | {[key: string]: TranslationNode};
export type TranslationContent = {[key: string]: TranslationNode};
export type TranslationStore = Map<string, Map<string, TranslationContent>>;