import { Options } from 'package-json';
import { PackageJson } from 'type-fest';
import { PackagePublishOption } from '../types';
declare type GetRemotePackageJson = (params: {
    name: string;
} & Options) => Promise<PackageJson | undefined>;
export declare function createPackagePublishOptions({ entry, cwd, version, getRemotePackageJson }: {
    entry: string[];
    cwd: string;
    version: string;
    getRemotePackageJson?: GetRemotePackageJson;
}): Promise<PackagePublishOption[]>;
export {};
