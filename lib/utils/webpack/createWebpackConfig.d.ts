/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
import { Config, WebpackFunction } from '../../types';
declare const _default: (config: Config, webpackFunctions: WebpackFunction[]) => Promise<Configuration>;
export = _default;
