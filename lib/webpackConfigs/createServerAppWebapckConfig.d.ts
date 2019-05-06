/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
export declare function createServerAppWebpackConfig({ cwd, app }: {
    cwd: string;
    app: string;
}): Configuration;
