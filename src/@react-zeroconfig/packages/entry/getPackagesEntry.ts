import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';
import { PackageInfo, packagesFileName } from '../rule';

interface Params {
  cwd: string;
}

export async function getPackagesEntry({ cwd }: Params): Promise<Map<string, PackageInfo>> {
  const source: string = await fs.readFile(path.join(cwd, packagesFileName), {
    encoding: 'utf8',
  });
  const entry: { [name: string]: string | { version: string; tag?: string } } = yaml.safeLoad(source);
  const packages: { [name: string]: string | { version: string; tag?: string } } = {};

  for (const name of Object.keys(entry)) {
    if (/\/\*$/.test(name)) {
      const groupName: string = name.split('/')[0];
      const dir: string = path.join(cwd, 'src', groupName);
      const files: string[] = await fs.readdir(dir);

      for (const pkgName of files) {
        const pkgDir: string = path.join(dir, pkgName);
        if (fs.statSync(pkgDir).isDirectory() && fs.readdirSync(pkgDir).length > 0) {
          packages[groupName + '/' + pkgName] = entry[name];
        }
      }
    } else {
      packages[name] = entry[name];
    }
  }

  return Object.keys(packages).reduce((map, name) => {
    const versionOrInfo: string | { version: string; tag?: string } = packages[name];
    const version: string = typeof versionOrInfo === 'string' ? versionOrInfo : versionOrInfo.version;
    const tag: string = typeof versionOrInfo === 'string' ? 'latest' : versionOrInfo.tag || 'latest';

    map.set(name, {
      name,
      version,
      tag,
    });

    return map;
  }, new Map<string, PackageInfo>());
}
