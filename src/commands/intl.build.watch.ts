import path from 'path';
import { Config } from '../types';
import getCurrentTime from '../utils/getCurrentTime';
import watchTranslation from '../utils/translation/watch';

export = function ({appDirectory}: Config) {
  watchTranslation({
    appDirectory: appDirectory,
    outputPath: path.join(appDirectory, 'src/generated/locales.json'),
    type: 'intl',
  }).subscribe(
    () => {
      console.log(`[${getCurrentTime()}] 👍 Translation build is successful.`);
    },
    (error: Error) => {
      console.error(`[${getCurrentTime()}] 💀 Translation build is failed.`);
      console.error(error);
    },
  );
};