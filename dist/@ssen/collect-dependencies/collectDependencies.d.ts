import { PackageJson } from 'type-fest';
import ts from 'typescript';
import { PackageInfo } from './types';
export declare const collectTypeScript: {
    extensions: string[];
    excludes: string[];
    includes: string[];
};
export declare const collectScripts: {
    extensions: string[];
    excludes: string[];
    includes: string[];
};
interface CollectDependenciesParams {
    rootDir: string;
    internalPackages: Map<string, PackageInfo>;
    externalPackages: PackageJson.Dependency;
    extensions?: string[];
    excludes?: string[];
    includes?: string[];
    compilerOptions?: ts.CompilerOptions;
}
export declare function collectDependencies({ rootDir, internalPackages, externalPackages, extensions, excludes, includes, compilerOptions, }: CollectDependenciesParams): Promise<PackageJson.Dependency>;
export {};
