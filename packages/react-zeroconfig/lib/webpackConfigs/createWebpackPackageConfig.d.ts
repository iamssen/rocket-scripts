/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
export declare function createWebpackPackageConfig({ cwd, targets, }: {
    cwd: string;
    targets?: string | string[];
}): Configuration;
