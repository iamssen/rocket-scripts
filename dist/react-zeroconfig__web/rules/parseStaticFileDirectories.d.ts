interface Params {
    cwd: string;
    app: string;
    staticFileDirectories: string[];
}
export declare function parseStaticFileDirectories({ cwd, app, staticFileDirectories }: Params): string[];
export {};
