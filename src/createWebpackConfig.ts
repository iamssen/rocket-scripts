import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import { Config, WebpackFunction } from './types';

export = function (config: Config, webpackFunctions: WebpackFunction[]): Promise<Configuration> {
  return Promise
    .all(webpackFunctions.map(f => f(config)))
    .then(webpackConfigs => webpackMerge(...webpackConfigs));
};