import { PackageJson } from 'type-fest';
interface Params {
    cwd: string;
}
export declare function getDependencies({ cwd }: Params): Promise<PackageJson.Dependency>;
export {};
