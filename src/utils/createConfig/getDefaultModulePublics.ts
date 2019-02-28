import fs from 'fs';
import path from 'path';
import { Config } from '../../types';
import { getDefaultModulesEntry } from './getDefaultModulesEntry';

export function getDefaultModulePublics(appDirectory: Config['appDirectory']): string[] {
  return getDefaultModulesEntry(appDirectory)
    .map((moduleName: string) => path.join(appDirectory, `src/_modules/${moduleName}/public`))
    .filter((publicPath: string) => fs.existsSync(publicPath) && fs.statSync(publicPath).isDirectory())
    .map((publicPath: string) => path.relative(appDirectory, publicPath).split(path.sep).join('/'));
}