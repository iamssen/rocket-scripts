import { PackageJson } from 'type-fest';
export interface PackageInfo {
    name: string;
    version: string;
    tag: string;
}
export interface PackageEntry extends PackageInfo {
    packageDir: string;
    outDir: string;
    computedPackageJson: PackageJson;
}
