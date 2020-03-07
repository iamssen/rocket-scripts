import fs from 'fs';
import path from 'path';
import { Configuration } from 'webpack';

export function createWebpackBaseConfig({zeroconfigPath}: {zeroconfigPath: string}): Configuration {
  const modules: string[] = ['node_modules'];
  const zeroconfigModules: string = path.join(zeroconfigPath, 'node_modules');
  
  if (fs.existsSync(zeroconfigModules) && fs.statSync(zeroconfigModules).isDirectory()) {
    modules.push(zeroconfigModules);
  }
  
  return {
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.mdx'],
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