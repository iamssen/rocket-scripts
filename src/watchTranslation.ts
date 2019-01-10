import { FSWatcher, watch } from 'chokidar';
import debounce from 'debounce';
import fs from 'fs-extra';
import { Observable, Subscribable } from 'rxjs';
import exportTranslation from './exportTranslation';
import { Config, TranslationStore } from './types';

interface Params {
  appDirectory: Config['appDirectory'];
  outputPath: string;
}

export = function ({appDirectory, outputPath}: Params): Subscribable<void> {
  return Observable.create(observer => {
    const watcher: FSWatcher = watch(
      `${appDirectory}/src/**/locales/[a-z][a-z]-[A-Z][A-Z].json`,
    );
    
    const translations: TranslationStore = new Map();
    
    const exportTranslationFiles: () => void = debounce(() => {
      exportTranslation({
        translations,
        outputPath,
      }).then(() => {
        observer.next();
      });
    }, 100);
    
    function update(filePath: string) {
      const translationJsonContent: object = fs.readJsonSync(filePath, {encoding: 'utf8'});
      const languageCode: string = (/\/([a-z]{2}-[A-Z]{2}).json$/.exec(filePath) as RegExpExecArray)[1];
      
      if (!translations.has(languageCode)) {
        translations.set(languageCode, new Map());
      }
      
      const language: Map<string, object> | undefined = translations.get(languageCode);
      
      if (language) {
        language.set(filePath, translationJsonContent);
      }
      
      exportTranslationFiles();
    }
    
    function unlik(filePath: string) {
      const languageCode: string = (/\/([a-z]{2}-[A-Z]{2}).json$/.exec(filePath) as RegExpExecArray)[1];
      
      if (translations.has(languageCode)) {
        const language: Map<string, object> | undefined = translations.get(languageCode);
        
        if (language && language.has(filePath)) {
          language.delete(filePath);
        }
        
        exportTranslationFiles();
      }
    }
    
    watcher
      .on('add', update)
      .on('change', update)
      .on('unlink', unlik);
  });
}