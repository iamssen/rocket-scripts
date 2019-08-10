import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';
import { getImportedPackagesFromFiles } from '../analyze/getImportedPackagesFromFiles';
import { glob } from '../utils/glob-promise';

export async function findInternalPackageMissingDependencies({packageDir}: {packageDir: string}): Promise<Set<string> | undefined> {
  const packageJson: string = path.join(packageDir, 'package.json');
  
  if (!fs.pathExistsSync(packageJson)) {
    throw new Error('package.json이 없는 directory는 입력되면 안된다!');
  }
  
  const sourceFiles: string[] = await glob(`${packageDir}/**/*.{js,jsx,mjs,ts,tsx}`, {
    ignore: [
      '**/public/**/*',
      '**/__*__/**/*',
      '**/*.{stories,story,test,spec}.{js,jsx,mjs,ts,tsx}',
    ],
  });
  
  if (sourceFiles.length === 0) return undefined;
  
  const {
    dependencies,
    devDependencies,
    peerDependencies,
    optionalDependencies,
  }: PackageJson = await fs.readJson(packageJson);
  
  const wrotePackages: Set<string> = new Set([
    ...Object.keys(dependencies || {}),
    ...Object.keys(devDependencies || {}),
    ...Object.keys(peerDependencies || {}),
    ...Object.keys(optionalDependencies || {}),
  ]);
  
  const importedPackages: Set<string> = await getImportedPackagesFromFiles(sourceFiles);
  
  for (const packageName of importedPackages) {
    if (wrotePackages.has(packageName)) {
      importedPackages.delete(packageName);
    }
  }
  
  return importedPackages.size > 0
    ? importedPackages
    : undefined;
}