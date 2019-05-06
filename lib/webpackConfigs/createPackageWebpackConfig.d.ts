/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
export declare function createPackageWebpackConfig({ name, cwd, file, externals }: {
    name: string;
    cwd: string;
    file: string;
    externals: string[];
}): Configuration;
