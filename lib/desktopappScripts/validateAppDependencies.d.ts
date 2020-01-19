import { PackageJson } from 'type-fest';
interface Params {
    projectPackageJson: PackageJson;
    appPackageJson: PackageJson;
}
export declare function validateAppDependencies({ projectPackageJson, appPackageJson: { dependencies }, }: Params): void;
export {};
