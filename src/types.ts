import { PackageJson } from 'type-fest';

// tslint:disable:typedef
export const packageCommands = ['build', 'publish'] as const;
export const webappCommands = ['build', 'start', 'server-watch', 'server-start', 'browser-start'] as const;
export const modes = ['production', 'development'] as const;
// tslint:enable:typedef

export type PackageCommand = typeof packageCommands[number];
export type WebappCommand = typeof webappCommands[number];
export type Mode = typeof modes[number];

const packageCommandSet: Set<string> = new Set(packageCommands);
const webappCommandSet: Set<string> = new Set(webappCommands);
const modeSet: Set<string> = new Set(modes);

export function isPackageCommand(command: string): boolean {
  return packageCommandSet.has(command);
}

export function isWebappCommand(command: string): boolean {
  return webappCommandSet.has(command);
}

export function isMode(mode: string): boolean {
  return modeSet.has(mode);
}

export interface PackageArgv {
  command: PackageCommand;
}

export interface PackageBuildOption {
  /** module name is package.json name */
  name: string;
  /** absolute index file location */
  file: string;
  /** build typescript declarations */
  buildTypescriptDeclaration: boolean;
  /** external libraries */
  externals: string[];
}

export interface PackagePublishOption {
  /** module name is package.json name */
  name: string;
  /** tag (eg. latest, alpha, beta) */
  tag: string;
  /** current package.json */
  currentPackageJson: PackageJson;
  /** remote package.json */
  remotePackageJson: PackageJson | undefined;
}

export interface WebappArgv {
  // common
  command: WebappCommand;
  app: string;
  
  // --static-file-directories "public static" - relative paths from cwd or absolute paths
  // --static-file-packages "xxx yyy" - packages
  staticFileDirectories: string | undefined;
  staticFilePackages: string | undefined;
  
  // build
  // --size-report false
  // --mode "production" | "development"
  // --output "/path/to" - relative paths from cwd or absolute paths
  // --app-file-name "app"
  // --vendor-file-name "vendor"
  // --style-file-name "style"
  // --chunk-path "" - a relative path from output
  // --public-path ""
  sizeReport: boolean;
  mode: Mode;
  output: string | undefined;
  appFileName: string;
  vendorFileName: string;
  styleFileName: string;
  chunkPath: string;
  publicPath: string;
  
  // start
  // --port 3100
  // --server-port 4100
  // --https true | false
  // --https-key path-to-custom.key --https-cert path-to-custom.crt
  port: number;
  serverPort: number;
  https: boolean | {key: string, cert: string};
}

export interface WebappConfig {
  command: WebappCommand;
  app: string;
  
  // build
  staticFileDirectories: string[]; // absolute paths
  
  sizeReport: boolean;
  mode: Mode;
  output: string; // absolute paths
  appFileName: string;
  vendorFileName: string;
  styleFileName: string;
  chunkPath: string; // a relative path from output
  publicPath: string;
  
  // start
  port: number;
  serverPort: number;
  https: boolean | {key: string, cert: string};
  
  // internal
  cwd: string; // a absolute path
  zeroconfigPath: string; // a absolute path
  extend: {
    serverSideRendering: boolean;
    templateFiles: string[]; // file names without directory path
  }
}