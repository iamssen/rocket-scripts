import fs from 'fs-extra';
import path from 'path';
import { getInternalPackageEntry } from '../internalPackage/getInternalPackageEntry';

export function getWebpackAlias({ cwd }: { cwd: string }): { [moduleName: string]: string } {
  const src: string = path.join(cwd, 'src');
  const alias: { [moduleName: string]: string } = {};
  const packageDir: string = path.join(src, '_packages');

  fs.readdirSync(src)
    .filter((dirname: string) => dirname[0] !== '_')
    .map((dirname: string) => path.join(src, dirname))
    .filter((dirpath: string) => fs.statSync(dirpath).isDirectory())
    .forEach((dirpath: string) => (alias[path.basename(dirpath)] = path.resolve(cwd, dirpath)));

  if (fs.existsSync(packageDir) && fs.statSync(packageDir).isDirectory()) {
    getInternalPackageEntry({ packageDir: path.join(src, '_packages') })
      .filter((packageName: string) => fs.statSync(path.join(src, `_packages/${packageName}`)).isDirectory())
      .forEach((packageName: string) => (alias[packageName] = path.join(src, `_packages/${packageName}`)));
  }

  return alias;
}
