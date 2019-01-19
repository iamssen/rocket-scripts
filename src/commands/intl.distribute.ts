import fs from 'fs';
import path from 'path';
import distributeTranslation from '../distributeTranslation';
import getCurrentTime from '../getCurrentTime';
import { Config } from '../types';

export = function ({appDirectory}: Config) {
  const filePath: string = path.join(appDirectory, 'src/generated/locales.json');
  
  if (fs.existsSync(filePath)) {
    distributeTranslation({
      filePath,
      appDirectory,
      type: 'intl',
    }).then(() => {
        console.log(`[${getCurrentTime()}] 👍 Translation distribute is successful.`);
      })
      .catch(error => {
        console.error(`[${getCurrentTime()}] 💀 Translation distribute is failed.`);
        console.error(error);
      });
  } else {
    console.error(`[${getCurrentTime()}] 💀 "${filePath}" does not exists.`);
  }
}