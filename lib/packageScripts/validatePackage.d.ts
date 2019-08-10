export declare function validatePackage({ name, packageDir }: {
    name: string;
    packageDir: string;
}): Promise<Error[] | undefined>;
