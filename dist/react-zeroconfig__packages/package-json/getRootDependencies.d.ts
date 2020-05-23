import { PackageJson } from 'type-fest';
interface Params {
    cwd: string;
}
export declare function getRootDependencies({ cwd }: Params): Promise<PackageJson.Dependency>;
export {};
