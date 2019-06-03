/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
export declare function createWebpackWebappConfig({ extractCss, cwd, chunkPath, publicPath }: {
    extractCss: boolean;
    cwd: string;
    chunkPath: string;
    publicPath: string;
}): Configuration;
