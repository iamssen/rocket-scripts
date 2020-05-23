import { PackageJson } from 'type-fest';
export interface PackageInfo {
    name: string;
    version: string;
    tag: string;
}
export interface PublishOption {
    name: string;
    tag: string;
    current: PackageJson;
    remote: PackageJson | undefined;
}
