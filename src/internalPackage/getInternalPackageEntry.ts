import fs from 'fs-extra';
import path from 'path';
import { glob } from '../utils/glob-promise';

export async function getInternalPackageEntry({packageDir}: {packageDir: string}): Promise<string[]> {
  if (!fs.pathExistsSync(packageDir) || !fs.statSync(packageDir).isDirectory()) return [];
  
  const packageJsonPaths: string[] = await glob(`${packageDir}/**/package.json`);
  
  return packageJsonPaths
    .map((packageJsonPath: string) => path.dirname(packageJsonPath)) // remove package.json
    .map((dirname: string) => path.relative(packageDir, dirname).split(path.sep)) // remove /.../_packages/ and split with directory separator
    .map((dirnamePaths: string[]) => dirnamePaths.join('/'));
}