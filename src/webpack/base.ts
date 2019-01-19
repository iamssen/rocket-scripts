import fs from 'fs';
import path from 'path';
import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import { Config } from '../types';

export = (webpackConfig: Configuration) => ({app, appDirectory, zeroconfigDirectory}: Config): Promise<Configuration> => {
  const modules: string[] = ['node_modules'];
  
  if (fs.existsSync(path.join(zeroconfigDirectory, 'node_modules'))) {
    modules.push(path.join(zeroconfigDirectory, 'node_modules'));
  }
  
  return Promise.resolve(webpackMerge({
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    
    resolveLoader: {
      modules,
    },
    
    performance: {
      hints: 'warning',
      maxEntrypointSize: 30000000,
      maxAssetSize: 20000000,
    },
    
    stats: {
      modules: false,
      maxModules: 0,
      errors: true,
      warnings: true,
      
      children: false,
      
      moduleTrace: true,
      errorDetails: true,
    },
  }, webpackConfig));
};