/// <reference types="webpack-dev-server" />
import webpack from 'webpack';
import { Config } from '../types';
declare const _default: () => ({ app, appDirectory }: Config) => Promise<webpack.Configuration>;
export = _default;
