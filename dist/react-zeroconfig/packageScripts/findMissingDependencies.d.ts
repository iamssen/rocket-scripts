import { PackageJson } from 'type-fest';
export declare function findMissingDependencies({ cwd }: {
    cwd: string;
}): Promise<PackageJson.Dependency>;
