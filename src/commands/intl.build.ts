import path from 'path';
import { Config } from '../types';
import getCurrentTime from '../utils/getCurrentTime';
import buildTranslation from '../utils/translation/build';

export = function ({appDirectory}: Config) {
  buildTranslation({
    appDirectory: appDirectory,
    outputPath: path.join(appDirectory, 'src/generated/locales.json'),
    type: 'intl',
  }).then(() => {
      console.log(`[${getCurrentTime()}] 👍 Translation build is successful.`);
    })
    .catch((error: Error) => {
      console.error(`[${getCurrentTime()}] 💀 Translation build is failed.`);
      console.error(error);
    });
};