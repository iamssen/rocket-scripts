import fs from 'fs';
import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import { Config } from '../types';

export = (webpackConfig: Configuration) => ({app, appDirectory, ssenpackDirectory}: Config): Promise<Configuration> => {
  const modules: string[] = ['node_modules'];
  
  if (fs.existsSync(`${ssenpackDirectory}/node_modules`)) {
    modules.push(`${ssenpackDirectory}/node_modules`);
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
      maxEntrypointSize: 3000000,
      maxAssetSize: 2000000,
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