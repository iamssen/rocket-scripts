import fs from 'fs';
import path from 'path';

interface Params {
  appDirectory: string;
}

export = function ({appDirectory}: Params): {[moduleName: string]: string} {
  const src: string = `${appDirectory}/src`;
  const alias: {[moduleName: string]: string} = {};
  
  fs.readdirSync(src)
    .filter(dirname => dirname[0] !== '_')
    .map(dirname => `${src}/${dirname}`)
    .filter(dirpath => fs.statSync(dirpath).isDirectory())
    .forEach(dirpath => {
      alias[path.basename(dirpath)] = path.resolve(appDirectory, dirpath);
    });
  
  fs.readdirSync(`${src}/_modules`)
    .map(dirname => `${src}/_modules/${dirname}`)
    .filter(dirpath => fs.statSync(dirpath).isDirectory())
    .forEach(dirpath => {
      alias[path.basename(dirpath)] = path.resolve(appDirectory, dirpath);
    });
  
  return alias;
}