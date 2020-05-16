import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';
import { PackageInfo } from '../types';
import { packagesFileName } from './fileNames';

interface Params {
  cwd: string;
}

export async function getPackagesEntry({ cwd }: Params): Promise<Map<string, PackageInfo>> {
  const source: string = await fs.readFile(path.join(cwd, packagesFileName), {
    encoding: 'utf8',
  });
  const packages: { [name: string]: string | { version: string; tag?: string } } = yaml.safeLoad(source);

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
