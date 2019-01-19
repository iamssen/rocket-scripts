import path from 'path';
import runNodemon from '../runNodemon';
import { Config } from '../types';

export = function ({appDirectory}: Config) {
  runNodemon({
    filePath: path.join(appDirectory, 'dist-dev/ssr/index.js'),
  });
};