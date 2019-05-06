import { execSync } from 'child_process';
import path from 'path';
import { PackagePublishOption } from '../types';

export function publishPackage({publishOption, cwd, exec = execSync}: {publishOption: PackagePublishOption, cwd: string, exec?: (command: string) => Buffer | string}): string {
  const {name} = publishOption;
  
  return exec(
    process.platform === 'win32'
      ? `cd "${path.join(cwd, 'dist/packages', name)}" && npm publish`
      : `cd "${path.join(cwd, 'dist/packages', name)}"; npm publish;`,
  ).toString();
}