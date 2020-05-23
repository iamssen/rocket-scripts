import { PackageInfo } from '../rule';
interface Params {
    cwd: string;
}
export declare function getPackagesEntry({ cwd }: Params): Promise<Map<string, PackageInfo>>;
export {};
