import chalk from 'chalk';
import fs from 'fs-extra';
import glob from 'glob';
import path from 'path';
import getCurrentTime from './getCurrentTime';
import { intlFormatToTranslation } from './intlFormatToTranslation';
import { Config, TranslationContent, TranslationType } from './types';

interface Params {
  filePath: string;
  appDirectory: Config['appDirectory'];
  type: TranslationType;
}

export = function ({filePath, appDirectory, type}: Params): Promise<void> {
  return new Promise((resolve, reject) => {
    const localesJsonContent: object = fs.readJsonSync(filePath, {encoding: 'utf8'});
    const localesContent: {[languageCode: string]: TranslationContent} = type === 'intl'
      ? intlFormatToTranslation(localesJsonContent)
      : localesJsonContent as {[languageCode: string]: TranslationContent};
    
    glob(`${appDirectory}/src/**/locales/[a-z][a-z]-[A-Z][A-Z].json`, (error, jsonFiles) => {
      if (error) {
        reject(error);
        return;
      }
      
      for (const jsonFile of jsonFiles) {
        const languageCode: string = path.basename(jsonFile, '.json');
        const jsonContent: object = fs.readJsonSync(jsonFile, {encoding: 'utf8'});
        const updated: Map<string, [string, string]> = new Map();
        
        function search(content: object, parentKeys: string[] = []) {
          Object.keys(content).forEach(key => {
            const keys: string[] = [...parentKeys, key];
            
            if (typeof content[key] === 'string') {
              const value: string = keys.reduce((data, k) => data[k], localesContent[languageCode]) as string;
              
              if (value !== content[key]) {
                updated.set(keys.join('.'), [content[key], value]);
                content[key] = value;
              }
            } else if (Object.keys(content[key]).length > 0) {
              search(content[key], keys);
            }
          });
        }
        
        search(jsonContent);
        
        if (updated.size > 0) {
          console.log(`[${getCurrentTime()}] 📝 "${jsonFile}" updated.`);
          
          for (const [keys, [prev, next]] of updated) {
            console.log(`   ${chalk.underline.bold(keys)} ${chalk.gray(prev)} → ${next}`);
          }
          
          fs.writeJsonSync(jsonFile, jsonContent, {encoding: 'utf8', spaces: 2});
        }
      }
    });
  });
}