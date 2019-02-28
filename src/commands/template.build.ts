import path from 'path';
import { Config } from '../types';
import getCurrentTime from '../utils/getCurrentTime';
import buildTemplate from '../utils/template/build';

export = function ({appDirectory}: Config) {
  buildTemplate({
    templateDirectory: path.join(appDirectory, 'src/_templates'),
    outputPath: path.join(appDirectory, 'public'),
  }).then(() => {
      console.log(`[${getCurrentTime()}] 👍 Template build is successful.`);
    })
    .catch((error: Error) => {
      console.error(`[${getCurrentTime()}] 💀 Template build is failed.`);
      console.error(error);
    });
}