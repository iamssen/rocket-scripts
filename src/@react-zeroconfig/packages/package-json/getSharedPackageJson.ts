import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';
import { sharedPackageJsonFileName } from '../rule';

interface Params {
  cwd: string;
}

export function getSharedPackageJson({ cwd }: Params): PackageJson {
  const sharedConfigFile: string = path.join(cwd, sharedPackageJsonFileName);
  return fs.existsSync(sharedConfigFile) ? fs.readJsonSync(sharedConfigFile) : {};
}
