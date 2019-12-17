import { PackageJson } from 'type-fest';
export declare const packageCommands: readonly ["build", "publish", "validate", "list", "sync"];
export declare const webappCommands: readonly ["build", "start", "server-watch", "server-start", "browser-start"];
export declare const modes: readonly ["production", "development"];
export declare type PackageCommand = typeof packageCommands[number];
export declare type WebappCommand = typeof webappCommands[number];
export declare type Mode = typeof modes[number];
export declare function isPackageCommand(command: string): command is PackageCommand;
export declare function isWebappCommand(command: string): command is WebappCommand;
export declare function isMode(mode: string | undefined): mode is Mode;
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
    command: WebappCommand;
    app: string;
    sourceMap: boolean | undefined;
    staticFileDirectories: string | undefined;
    staticFilePackages: string | undefined;
    sizeReport: boolean;
    mode: Mode;
    output: string | undefined;
    appFileName: string;
    vendorFileName: string;
    styleFileName: string;
    chunkPath: string;
    publicPath: string;
    internalEslint: boolean;
    port: number;
    serverPort: number;
    https: boolean | {
        key: string;
        cert: string;
    };
}
export interface WebappConfig {
    command: WebappCommand;
    app: string;
    sourceMap: boolean | undefined;
    staticFileDirectories: string[];
    sizeReport: boolean;
    mode: Mode;
    output: string;
    appFileName: string;
    vendorFileName: string;
    styleFileName: string;
    chunkPath: string;
    publicPath: string;
    internalEslint: boolean;
    port: number;
    serverPort: number;
    https: boolean | {
        key: string;
        cert: string;
    };
    cwd: string;
    zeroconfigPath: string;
    extend: {
        serverSideRendering: boolean;
        templateFiles: string[];
    };
}
