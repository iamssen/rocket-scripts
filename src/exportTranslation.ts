import merge from 'deepmerge';
import fs from 'fs-extra';
import path from 'path';
import { TranslationStore } from './types';

interface Params {
  translations: TranslationStore;
  outputPath: string;
}

export = function ({translations, outputPath}: Params): Promise<void> {
  fs.mkdirpSync(path.dirname(outputPath));
  
  const json: {[languageCode: string]: object} = {};
  
  for (const [languageCode, translation] of translations) {
    json[languageCode] = merge.all(Array.from(translation.values()));
  }
  
  return fs.writeJson(outputPath, json, {spaces: 2});
};