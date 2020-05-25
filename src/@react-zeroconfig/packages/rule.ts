import { PackageJson } from 'type-fest';
import { CompilerOptions } from 'typescript';
import { Configuration } from 'webpack';

export const packagesFileName: string = '.zeroconfig.packages.yaml';
export const sharedPackageJsonFileName: string = '.zeroconfig.package.json';

export const packageJsonFactoryFileName: string = '.package.json.ts';
export const packageJsonFactoryFileNamePattern: RegExp = /.package.json.ts$/;

export const buildTransformFileName: string = '.build.ts';
export const buildTransformFileNamePattern: RegExp = /.build.ts$/;

export type TransformCompilerOptions = (compilerOptions: CompilerOptions) => CompilerOptions;
export type TransformWebpackConfig = (webpackConfig: Configuration) => Configuration;

export type TransformPackageJson = (computedPackageJson: PackageJson) => PackageJson;

export interface PackageJsonTransformFile {
  defualt: TransformPackageJson;
}

export interface BuildTransformFile {
  transformCompilerOptions?: TransformCompilerOptions;
  transformWebpackConfig?: TransformWebpackConfig;
}

export interface PackageInfo {
  name: string;
  version: string;
  tag: string;
}

export const collectPackageScripts: { extensions: string[]; excludes: string[]; includes: string[] } = {
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  excludes: [
    // exclude tests
    '**/*.spec.js',
    '**/*.spec.jsx',
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/*.test.js',
    '**/*.test.jsx',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/__tests__',
    '**/__test__',

    // exclude public
    '**/public',
  ],
  includes: ['**/*'],
};
