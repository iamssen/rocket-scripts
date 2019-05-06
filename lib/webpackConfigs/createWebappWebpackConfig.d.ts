/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
export declare function createWebappWebpackConfig({ extractCss, cwd, serverPort, publicPath }: {
    extractCss: boolean;
    cwd: string;
    serverPort: number;
    publicPath: string;
}): Configuration;
