import path from 'path';
import { Config } from '../types';
import runNodemon from '../utils/web/runNodemon';

export = function ({appDirectory}: Config) {
  runNodemon({
    filePath: path.join(appDirectory, 'dist-dev/ssr/index.js'),
  });
};