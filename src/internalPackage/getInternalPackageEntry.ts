import fs from 'fs-extra';
import glob from 'glob';
import path from 'path';

export function getInternalPackageEntry({packageDir}: {packageDir: string}): string[] {
  if (!fs.pathExistsSync(packageDir) || !fs.statSync(packageDir).isDirectory()) return [];
  
  const packageJsonPaths: string[] = glob.sync(`${packageDir}/**/package.json`);
  
  return packageJsonPaths
    .map((packageJsonPath: string) => path.dirname(packageJsonPath)) // remove package.json
    .map((dirname: string) => path.relative(packageDir, dirname).split(path.sep)) // remove /.../_packages/ and split with directory separator
    .map((dirnamePaths: string[]) => dirnamePaths.join('/'));
}