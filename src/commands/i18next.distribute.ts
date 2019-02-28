import fs from 'fs';
import path from 'path';
import { Config } from '../types';
import getCurrentTime from '../utils/getCurrentTime';
import distributeTranslation from '../utils/translation/distribute';

export = function ({appDirectory}: Config) {
  const filePath: string = path.join(appDirectory, 'src/generated/locales.json');
  
  if (fs.existsSync(filePath)) {
    distributeTranslation({
      filePath,
      appDirectory,
      type: 'i18next',
    }).then(() => {
        console.log(`[${getCurrentTime()}] 👍 Translation distribute is successful.`);
      })
      .catch((error: Error) => {
        console.error(`[${getCurrentTime()}] 💀 Translation distribute is failed.`);
        console.error(error);
      });
  } else {
    console.error(`[${getCurrentTime()}] 💀 "${filePath}" does not exists.`);
  }
}