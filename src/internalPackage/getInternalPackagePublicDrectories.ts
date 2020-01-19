import fs from 'fs-extra';
import path from 'path';
import { getInternalPackageEntry } from './getInternalPackageEntry';

export async function getInternalPackagePublicDrectories({packageDir}: {packageDir: string}): Promise<string[]> {
  return getInternalPackageEntry({packageDir})
    .map(packageName => path.join(packageDir, packageName, 'public'))
    .filter(publicDirectory => fs.pathExistsSync(publicDirectory) && fs.statSync(publicDirectory).isDirectory());
}