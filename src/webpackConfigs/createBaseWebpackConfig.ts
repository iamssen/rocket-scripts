import fs from 'fs';
import path from 'path';
import { Configuration } from 'webpack';

export function createBaseWebpackConfig({zeroconfigPath}: {zeroconfigPath: string}): Configuration {
  const modules: string[] = ['node_modules'];
  
  if (fs.existsSync(path.join(zeroconfigPath, 'node_modules'))) {
    modules.push(path.join(zeroconfigPath, 'node_modules'));
  }
  
  return {
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
  };
}