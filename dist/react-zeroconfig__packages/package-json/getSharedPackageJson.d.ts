import { PackageJson } from 'type-fest';
interface Params {
    cwd: string;
}
export declare function getSharedPackageJson({ cwd }: Params): PackageJson;
export {};
