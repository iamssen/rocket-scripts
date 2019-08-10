export declare function findInternalPackageMissingDependencies({ packageDir }: {
    packageDir: string;
}): Promise<Set<string> | undefined>;
