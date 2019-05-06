/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
export declare function patchStorybookWebpackConfig({ cwd, config }: {
    cwd?: string;
    config: Configuration;
}): Configuration;
