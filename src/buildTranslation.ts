import fs from 'fs-extra';
import glob from 'glob';
import exportTranslation from './exportTranslation';
import { Config, TranslationStore } from './types';

interface Params {
  appDirectory: Config['appDirectory'];
  outputPath: string;
}

export = function ({appDirectory, outputPath}: Params): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    glob(
      `${appDirectory}/src/**/locales/[a-z][a-z]-[A-Z][A-Z].json`,
      (error, filePaths) => {
        if (error) {
          reject(error);
          return;
        }
        
        const translations: TranslationStore = new Map();
        
        for (const filePath of filePaths) {
          const translationJsonContent: object = fs.readJsonSync(filePath, {encoding: 'utf8'});
          const languageCode: string = (/\/([a-z]{2}-[A-Z]{2}).json$/.exec(filePath) as RegExpExecArray)[1];
          
          if (!translations.has(languageCode)) {
            translations.set(languageCode, new Map());
          }
          
          const language: Map<string, object> | undefined = translations.get(languageCode);
          
          if (language) {
            language.set(filePath, translationJsonContent);
          }
        }
        
        exportTranslation({
          translations,
          outputPath,
        }).then(() => resolve());
      });
  });
}