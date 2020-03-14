/// <reference types="webpack-dev-server" />
import { Subscribable } from 'rxjs';
import { Compiler, Configuration } from 'webpack';
export declare function watchWebpack(webpackConfig: Configuration, watchOptions?: Compiler.WatchOptions): Subscribable<string>;
