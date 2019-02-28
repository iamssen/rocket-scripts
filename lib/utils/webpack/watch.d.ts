/// <reference types="webpack-dev-server" />
import { Subscribable } from 'rxjs';
import webpack from 'webpack';
import { Config } from '../../types';
declare const _default: (config: Config, webpackConfig: webpack.Configuration, watchOptions?: webpack.ICompiler.WatchOptions) => Subscribable<void>;
export = _default;
