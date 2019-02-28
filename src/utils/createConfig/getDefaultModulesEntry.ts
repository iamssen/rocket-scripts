import fs from "fs";
import path from "path";
import { Config } from '../../types';
import glob from 'glob';

export function getDefaultModulesEntry(appDirectory: Config['appDirectory']): Config['modules']['entry'] {
  if (!fs.existsSync(path.join(appDirectory, 'src/_modules')) || !fs.statSync(path.join(appDirectory, 'src/_modules')).isDirectory()) {
    return [];
  }
  
  return glob
    .sync(`${appDirectory}/src/_modules/**/package.json`)
    .map((packageJsonPath: string) => path.dirname(packageJsonPath))
    .map((dirname: string) => path.relative(path.join(appDirectory, 'src/_modules'), dirname).split(path.sep))
    .map((dirnamePaths: string[]) => dirnamePaths.join('/'));
}