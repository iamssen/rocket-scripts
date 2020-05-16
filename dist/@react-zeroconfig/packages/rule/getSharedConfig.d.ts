import { PackageJson } from 'type-fest';
interface Params {
    cwd: string;
}
export declare function getSharedConfig({ cwd }: Params): PackageJson;
export {};
