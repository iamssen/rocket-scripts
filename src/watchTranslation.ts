import { FSWatcher, watch } from 'chokidar';
import debounce from 'debounce';
import fs from 'fs-extra';
import { Observable, Subscribable } from 'rxjs';
import exportTranslation from './exportTranslation';
import { Config, TranslationContent, TranslationStore, TranslationType } from './types';

interface Params {
  appDirectory: Config['appDirectory'];
  outputPath: string;
  type: TranslationType;
}

export = function ({appDirectory, outputPath, type}: Params): Subscribable<void> {
  return Observable.create(observer => {
    const watcher: FSWatcher = watch(
      `${appDirectory}/src/**/locales/[a-z][a-z]-[A-Z][A-Z].json`,
    );
    
    const translationStore: TranslationStore = new Map();
    
    const exportI18nextFiles: () => void = debounce(() => {
      exportTranslation({
        translationStore,
        outputPath,
        type,
      }).then(() => {
        observer.next();
      });
    }, 100);
    
    function update(filePath: string) {
      const translationJsonContent: TranslationContent = fs.readJsonSync(filePath, {encoding: 'utf8'});
      const languageCode: string = (/\/([a-z]{2}-[A-Z]{2}).json$/.exec(filePath) as RegExpExecArray)[1];
      
      if (!translationStore.has(languageCode)) {
        translationStore.set(languageCode, new Map());
      }
      
      const languageContentMap: Map<string, TranslationContent> | undefined = translationStore.get(languageCode);
      
      if (languageContentMap) {
        languageContentMap.set(filePath, translationJsonContent);
      }
      
      exportI18nextFiles();
    }
    
    function unlik(filePath: string) {
      const languageCode: string = (/\/([a-z]{2}-[A-Z]{2}).json$/.exec(filePath) as RegExpExecArray)[1];
      
      if (translationStore.has(languageCode)) {
        const language: Map<string, TranslationContent> | undefined = translationStore.get(languageCode);
        
        if (language && language.has(filePath)) {
          language.delete(filePath);
        }
        
        exportI18nextFiles();
      }
    }
    
    watcher
      .on('add', update)
      .on('change', update)
      .on('unlink', unlik);
  });
}