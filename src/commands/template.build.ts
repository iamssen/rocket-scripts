import path from 'path';
import buildTemplate from '../buildTemplate';
import getCurrentTime from '../getCurrentTime';
import { Config } from '../types';

export = function ({appDirectory}: Config) {
  buildTemplate({
    templateDirectory: path.join(appDirectory, 'src/_templates'),
    outputPath: path.join(appDirectory, 'public'),
  }).then(() => {
      console.log(`[${getCurrentTime()}] 👍 Template build is successful.`);
    })
    .catch(error => {
      console.error(`[${getCurrentTime()}] 💀 Template build is failed.`);
      console.error(error);
    });
}