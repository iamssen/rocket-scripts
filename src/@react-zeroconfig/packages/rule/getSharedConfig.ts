import path from 'path';
import fs from 'fs-extra';
import { PackageJson } from 'type-fest';
import { sharedPackageJsonFileName } from './fileNames';

interface Params {
  cwd: string;
}

export function getSharedConfig({ cwd }: Params): PackageJson {
  const sharedConfigFile: string = path.join(cwd, sharedPackageJsonFileName);
  return fs.existsSync(sharedConfigFile) ? fs.readJsonSync(sharedConfigFile) : {};
}
