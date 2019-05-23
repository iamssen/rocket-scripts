import fs from 'fs-extra';
import path from 'path';

export function getWebpackAlias({cwd}: {cwd: string}): {[moduleName: string]: string} {
  const src: string = path.join(cwd, 'src');
  const alias: {[moduleName: string]: string} = {};
  const packageDir: string = path.join(src, '_packages');
  
  fs.readdirSync(src)
    .filter((dirname: string) => dirname[0] !== '_')
    .map((dirname: string) => path.join(src, dirname))
    .filter((dirpath: string) => fs.statSync(dirpath).isDirectory())
    .forEach((dirpath: string) => alias[path.basename(dirpath)] = path.resolve(cwd, dirpath));
  
  if (fs.existsSync(packageDir) && fs.statSync(packageDir).isDirectory()) {
    fs.readdirSync(path.join(src, '_packages'))
      .map((dirname: string) => path.join(src, `_packages/${dirname}`))
      .filter((dirpath: string) => fs.statSync(dirpath).isDirectory())
      .forEach((dirpath: string) => alias[path.basename(dirpath)] = path.resolve(cwd, dirpath));
  }
  
  return alias;
}