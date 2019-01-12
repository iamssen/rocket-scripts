import { Configuration } from 'webpack';
import { Config } from '../types';
declare const _default: (webpackConfig: Configuration) => ({ app, appDirectory, zeroconfigDirectory }: Config) => Promise<Configuration>;
export = _default;
