/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
export declare function createWebpackEnvConfig({ serverPort, publicPath }: {
    serverPort: number;
    publicPath: string;
}): Configuration;
