import path from 'path';
import { Configuration } from 'webpack';
import { Config } from './types';
import createConfig from './utils/createConfig';
import getAlias from './utils/webpack/getAlias';

export = function (appDirectory: string = process.cwd()): Configuration {
  const config: Config = createConfig({
    command: 'editor.webpack',
    appDirectory,
    zeroconfigDirectory: path.join(__dirname, '..'),
  });
  
  return {
    resolve: {
      alias: getAlias(config),
    },
  };
}