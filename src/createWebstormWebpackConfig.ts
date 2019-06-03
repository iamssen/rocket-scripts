import { Configuration } from 'webpack';
import { getWebpackAlias } from './webpackConfigs/getWebpackAlias';

export function createWebstormWebpackConfig({cwd = process.cwd()}: {cwd?: string} = {}): Configuration {
  return {
    resolve: {
      alias: getWebpackAlias({cwd}),
    },
  };
}