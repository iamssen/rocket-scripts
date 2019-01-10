import runNodemon from '../runNodemon';
import { Config } from '../types';

export = function ({appDirectory}: Config) {
  runNodemon({
    filePath: `${appDirectory}/dist-dev/ssr/index.js`,
  });
};