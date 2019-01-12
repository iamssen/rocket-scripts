import buildTranslation from '../buildTranslation';
import getCurrentTime from '../getCurrentTime';
import { Config } from '../types';

export = function ({appDirectory}: Config) {
  buildTranslation({
    appDirectory: appDirectory,
    outputPath: `${appDirectory}/src/generated/locales.json`,
    type: 'intl',
  }).then(() => {
      console.log(`[${getCurrentTime()}] 👍 Translation build is successful.`);
    })
    .catch(error => {
      console.error(`[${getCurrentTime()}] 💀 Translation build is failed.`);
      console.error(error);
    });
};