import fs from 'fs-extra';
import path from 'path';
import { getInternalPackageEntry } from './getInternalPackageEntry';

export async function getInternalPackagePublicDrectories({cwd}: {cwd: string}): Promise<string[]> {
  return (await getInternalPackageEntry({cwd}))
    .map(packageName => path.join(cwd, 'src/_packages', packageName, 'public'))
    .filter(publicDirectory => fs.pathExistsSync(publicDirectory) && fs.statSync(publicDirectory).isDirectory());
}