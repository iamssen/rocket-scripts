/// <reference types="react" />
export interface StartPrams {
    cwd: string;
    app: string;
    outDir: string;
    publicPath?: string;
    /** relative path from output */
    chunkPath?: string;
    externals?: string[];
    staticFileDirectories?: string[];
    port?: 'random' | number;
    https?: boolean | {
        key: string;
        cert: string;
    };
}
export declare type StartProps = Required<Omit<StartPrams, 'port'>> & {
    appDir: string;
    port: number;
};
export declare function Start({ cwd, app, outDir, publicPath, chunkPath, staticFileDirectories, externals, port, https, appDir, }: StartProps): JSX.Element;
export declare function start({ cwd, app, outDir: _outDir, publicPath, chunkPath: _chunkPath, staticFileDirectories: _staticFileDirectories, externals, port: _port, https, }: StartPrams): Promise<void>;
