/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
export declare function createBrowserAppWebpackConfig({ chunkPath, vendorFileName, styleFileName, hash }: {
    chunkPath: string;
    vendorFileName: string;
    styleFileName: string;
    hash: string;
}): Configuration;
