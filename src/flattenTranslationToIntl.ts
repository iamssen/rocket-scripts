import { TranslationContent, TranslationNode } from './types';

export function flattenTranslationToIntl(translationContent: TranslationContent): object {
  const result: object = {};
  
  function search(content: TranslationContent, parentKeys: string[] = []) {
    Object.keys(content).forEach(key => {
      const keys: string[] = [...parentKeys, key];
      const value: TranslationNode = content[key];
      
      if (typeof value === 'string') {
        result[keys.join('.')] = value;
      } else {
        search(value as TranslationContent, keys);
      }
    });
  }
  
  search(translationContent);
  
  return result;
}