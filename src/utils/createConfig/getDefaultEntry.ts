import fs from 'fs';
import path from 'path';
import { Config } from '../../types';

export function getDefaultEntry(appDirectory: Config['appDirectory']): string[] {
  const entryFilesOrDirectories: string[] = fs.readdirSync(path.join(appDirectory, 'src/_entry'));
  const entry: string[] = [];
  
  for (const entryName of entryFilesOrDirectories) {
    if (fs.statSync(path.join(appDirectory, 'src/_entry', entryName)).isDirectory()) {
      if (fs.existsSync(path.join(appDirectory, 'src/_entry', entryName, 'index.js'))
        || fs.existsSync(path.join(appDirectory, 'src/_entry', entryName, 'index.jsx'))
        || fs.existsSync(path.join(appDirectory, 'src/_entry', entryName, 'index.ts'))
        || fs.existsSync(path.join(appDirectory, 'src/_entry', entryName, 'index.tsx'))) {
        entry.push(entryName);
      }
    } else if (/\.(js|jsx|ts|tsx)$/.test(entryName)) {
      entry.push(path.basename(entryName, path.extname(entryName)));
    }
  }
  
  return entry;
}