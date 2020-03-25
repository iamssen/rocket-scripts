import { Options } from 'package-json';
import { PackageJson } from 'type-fest';
import { PackagePublishOption } from '../types';
declare type GetRemotePackageJson = (params: {
    name: string;
} & Options) => Promise<PackageJson | undefined>;
export declare function createPackagePublishOptions({ entry, cwd, getRemotePackageJson, }: {
    entry: string[];
    cwd: string;
    getRemotePackageJson?: GetRemotePackageJson;
}): Promise<PackagePublishOption[]>;
export {};
