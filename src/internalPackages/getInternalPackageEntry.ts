import fs from 'fs-extra';
import path from 'path';
import { glob } from '../utils/glob-promise';

export async function getInternalPackageEntry({cwd}: {cwd: string}): Promise<string[]> {
  const packages: string = path.join(cwd, 'src/_packages');
  
  if (!fs.pathExistsSync(packages) || !fs.statSync(packages).isDirectory()) return [];
  
  const packageJsonPaths: string[] = await glob(`${packages}/**/package.json`);
  
  return packageJsonPaths
    .map((packageJsonPath: string) => path.dirname(packageJsonPath)) // remove package.json
    .map((dirname: string) => path.relative(packages, dirname).split(path.sep)) // remove /.../_packages/ and split with directory separator
    .map((dirnamePaths: string[]) => dirnamePaths.join('/'));
}