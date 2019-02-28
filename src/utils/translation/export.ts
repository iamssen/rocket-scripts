import merge from 'deepmerge';
import fs from 'fs-extra';
import path from 'path';
import { TranslationContent, TranslationStore, TranslationType } from '../../types';
import { toIntl } from './toIntl';

interface Params {
  translationStore: TranslationStore;
  outputPath: string;
  type: TranslationType;
}

export = function ({translationStore, outputPath, type}: Params): Promise<void> {
  fs.mkdirpSync(path.dirname(outputPath));
  
  const content: {[languageCode: string]: object} = {};
  
  for (const [languageCode, translation] of translationStore) {
    const mergedContent: TranslationContent = merge.all(Array.from(translation.values())) as TranslationContent;
    content[languageCode] = type === 'intl' ? toIntl(mergedContent) : mergedContent;
  }
  
  return fs.writeJson(
    outputPath,
    content,
    {spaces: 2},
  );
};