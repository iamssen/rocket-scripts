interface PackageJson {
    name: string;
    dependencies?: {
        [name: string]: string;
    };
}
declare const _default: (packageJsonFiles: PackageJson[]) => string[];
export = _default;
