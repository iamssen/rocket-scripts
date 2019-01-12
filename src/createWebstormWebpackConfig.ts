import path from 'path';
import { Configuration } from 'webpack';
import createConfig from './createConfig';
import getAlias from './getAlias';
import { Config } from './types';

const config: Config = createConfig({
  command: 'editor.webpack',
  appDirectory: process.cwd(),
  zeroconfigDirectory: path.join(__dirname, '..'),
});

export = function (): Configuration {
  return {
    resolve: {
      alias: getAlias(config),
    },
  };
}