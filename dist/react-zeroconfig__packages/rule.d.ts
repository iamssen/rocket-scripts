export declare const packagesFileName: string;
export declare const sharedPackageJsonFileName: string;
export declare const packageJsonFactoryFileName: string;
export declare const packageJsonFactoryFileNamePattern: RegExp;
export interface PackageInfo {
    name: string;
    version: string;
    tag: string;
}
export declare const collectPackageScripts: {
    extensions: string[];
    excludes: string[];
    includes: string[];
};
