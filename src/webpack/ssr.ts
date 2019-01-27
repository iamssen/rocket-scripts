import path from 'path';
import { Configuration, LibraryTarget } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { Config } from '../types';

export = () => (config: Config): Promise<Configuration> => {
  const {appDirectory} = config;
  const target: 'node' = 'node';
  const libraryTarget: LibraryTarget = 'commonjs';
  
  return Promise.resolve({
    target,
    
    entry: {
      index: path.join(appDirectory, 'src/_entry/ssr'),
    },
    
    output: {
      libraryTarget,
    },
    
    externals: [nodeExternals({
      // include asset files
      whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
    })],
  });
};