import { Configuration, Options } from 'webpack';
import { Config } from '../types';

export = () => (config: Config): Promise<Configuration> => {
  const {app} = config;
  
  const cacheGroups: {[key: string]: Options.CacheGroupsOptions} = {
    // vendor chunk
    vendor: {
      test: /[\\/]node_modules[\\/]/,
      name: app.vendorFileName,
      chunks: 'all',
    },
    
    // extract single css file
    style: {
      test: m => m.constructor.name === 'CssModule',
      name: app.styleFileName,
      chunks: 'all',
      enforce: true,
    },
  };
  
  return Promise.resolve({
    output: {
      filename: `${app.buildPath}[name].js`,
      chunkFilename: `${app.buildPath}[name].js`,
    },
    
    optimization: {
      splitChunks: {
        cacheGroups,
      },
    },
  });
};