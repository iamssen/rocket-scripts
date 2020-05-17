import { flatPackageName } from '@ssen/flat-package-name';
import fs from 'fs-extra';
import getPackageJson, { Options } from 'package-json';
import path from 'path';
import { PackageJson } from 'type-fest';
import { PackageInfo, PublishOption } from './types';

export type GetRemotePackageJson = (params: { name: string } & Options) => Promise<PackageJson | undefined>;

const getNpmRemotePackageJson: GetRemotePackageJson = ({ name, ...options }) => {
  return getPackageJson(name, options)
    .then((value) => (value && typeof value.version === 'string' ? (value as PackageJson) : undefined))
    .catch(() => undefined);
};

interface Params {
  entry: Map<string, PackageInfo>;
  outDir: string;
  tag: string | undefined;
  registry: string | undefined;
  getRemotePackageJson?: GetRemotePackageJson;
}

export async function getPublishOptions({
  entry,
  outDir,
  tag: forceTag,
  registry: forceRegistry,
  getRemotePackageJson = getNpmRemotePackageJson,
}: Params): Promise<Map<string, PublishOption>> {
  if (!fs.existsSync(outDir) || !fs.statSync(outDir).isDirectory()) {
    throw new Error(`"${outDir}" directory is not exists`);
  }

  const tags: Map<string, string> = new Map();
  for (const [name, { tag }] of entry) {
    tags.set(name, tag || 'latest');
  }

  const currentPackageJsons: PackageJson[] = Array.from(entry.values())
    // PackageInfo => /path/to/dist/{name}/package.json
    .map(({ name: packageName }) => path.join(outDir, flatPackageName(packageName), 'package.json'))
    // /path/to/dist/{name}/package.json => boolean
    .filter((packageJsonFile) => fs.existsSync(packageJsonFile))
    // /path/to/dist/{name}/package.json => PackageJson
    .map((packageJsonFile) => fs.readJsonSync(packageJsonFile))
    // PackageJson => boolean
    .filter(({ name }) => typeof name === 'string');

  const remotePackageJsons: (PackageJson | undefined)[] = await Promise.all<PackageJson | undefined>(
    currentPackageJsons.map(({ name }) => {
      if (!name) throw new Error(``);

      return getRemotePackageJson({
        name,
        version: forceTag || tags.get(name),
        registryUrl: forceRegistry,
        fullMetadata: true,
      });
    }),
  );

  return Array.from(entry.values()).reduce((map, current, i) => {
    if (!current.name) throw new Error(``);

    map.set(current.name, {
      name: current.name,
      tag: tags.get(current.name)!,
      current,
      remote: remotePackageJsons[i],
    });

    return map;
  }, new Map());
}
