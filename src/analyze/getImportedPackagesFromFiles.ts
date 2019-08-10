import fs from 'fs-extra';
import { getImportedPackagesFromSource } from './getImportedPackagesFromSource';

export async function getImportedPackagesFromFiles(files: string[]): Promise<Set<string>> {
  const dependencies: Set<string> = new Set();
  
  for (const file of files) {
    const source: string = await fs.readFile(file, {encoding: 'utf8'});
    getImportedPackagesFromSource(source).forEach((packageName: string) => dependencies.add(packageName));
  }
  
  return dependencies;
}