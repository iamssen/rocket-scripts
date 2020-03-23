export declare function getStaticFileDirectories({ staticFileDirectories, staticFilePackages, cwd, }: {
    staticFileDirectories?: string | undefined;
    staticFilePackages?: string | undefined;
    cwd: string;
}): Promise<string[]>;
