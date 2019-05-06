import fs from 'fs-extra';
import getPackageJson, { Options } from 'package-json';
import path from 'path';
import { PackageJson } from 'type-fest';
import { PackagePublishOption } from '../types';

type GetRemotePackageJson = (params: {name: string} & Options) => Promise<PackageJson | undefined>;

const getNpmRemotePackageJson: GetRemotePackageJson = ({name, ...options}) => {
  return getPackageJson(name!, {
    version: 'latest',
    fullMetadata: true,
    ...options,
  }).then(value => value && typeof value.version === 'string' ? value as PackageJson : undefined)
    .catch(() => undefined);
};

export async function createPackagePublishOptions({entry, cwd, version, getRemotePackageJson = getNpmRemotePackageJson}: {entry: string[], cwd: string, version: string, getRemotePackageJson?: GetRemotePackageJson}): Promise<PackagePublishOption[]> {
  const packageDirectory: string = path.join(cwd, 'dist/packages');
  
  if (!fs.pathExistsSync(packageDirectory) || !fs.statSync(packageDirectory).isDirectory()) {
    throw new Error(`"${packageDirectory}" directory is undefined`);
  }
  
  const currentPackageJsons: PackageJson[] = entry
    .map(packageName => path.join(packageDirectory, packageName, 'package.json'))
    .filter(packageJsonFile => fs.existsSync(packageJsonFile))
    .map(packageJsonFile => fs.readJsonSync(packageJsonFile))
    .filter(({name}) => typeof name === 'string');
  
  const remotePackageJsons: PackageJson[] = await Promise.all<PackageJson>(
    currentPackageJsons.map(({name}) => getRemotePackageJson({name: name!, version, fullMetadata: true})),
  );
  
  return currentPackageJsons.map((currentPackageJson, i) => ({
    name: currentPackageJson.name!,
    currentPackageJson,
    remotePackageJson: remotePackageJsons[i],
  }));
}