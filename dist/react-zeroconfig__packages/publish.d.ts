interface Params {
    cwd: string;
    outDir: string;
    force?: boolean;
    registry?: string;
    tag?: string;
}
export declare function publish({ cwd, outDir, force, registry, tag }: Params): Promise<void>;
export {};
