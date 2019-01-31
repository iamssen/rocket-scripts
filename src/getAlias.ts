import fs from 'fs';
import path from 'path';

interface Params {
  appDirectory: string;
}

export = function ({appDirectory}: Params): {[moduleName: string]: string} {
  const src: string = path.join(appDirectory, 'src');
  const alias: {[moduleName: string]: string} = {};
  const modules: string = path.join(src, '_modules');
  
  fs.readdirSync(src)
    .filter((dirname: string) => dirname[0] !== '_')
    .map((dirname: string) => path.join(src, dirname))
    .filter((dirpath: string) => fs.statSync(dirpath).isDirectory())
    .forEach((dirpath: string) => {
      alias[path.basename(dirpath)] = path.resolve(appDirectory, dirpath);
    });
  
  if (fs.existsSync(modules) && fs.statSync(modules).isDirectory()) {
    fs.readdirSync(path.join(src, '_modules'))
      .map((dirname: string) => path.join(src, `_modules/${dirname}`))
      .filter((dirpath: string) => fs.statSync(dirpath).isDirectory())
      .forEach((dirpath: string) => {
        alias[path.basename(dirpath)] = path.resolve(appDirectory, dirpath);
      });
  }
  
  return alias;
}