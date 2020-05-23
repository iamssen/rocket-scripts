/// <reference types="webpack-dev-server" />
import { Configuration, Stats } from 'webpack';
export declare function runWebpack(webpackConfig: Configuration): Promise<Stats>;
