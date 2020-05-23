import { PackageJson } from 'type-fest';
import { PackageInfo } from '../rule';
interface Params {
    packageDir: string;
    packageInfo: PackageInfo;
    dependencies: PackageJson.Dependency;
    sharedConfig?: PackageJson;
}
export declare function computePackageJson({ packageDir, packageInfo, dependencies, sharedConfig, }: Params): Promise<PackageJson>;
export {};
