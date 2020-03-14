import fs from 'fs-extra';
import getPackageJson, { Options } from 'package-json';
import path from 'path';
import { PackageJson } from 'type-fest';
import { PackagePublishOption } from '../types';
import { prerelease } from 'semver';

type GetRemotePackageJson = (params: {name: string} & Options) => Promise<PackageJson | undefined>;

const getNpmRemotePackageJson: GetRemotePackageJson = ({name, ...options}) => {
  return getPackageJson(name, options)
    .then(value => value && typeof value.version === 'string' ? value as PackageJson : undefined)
    .catch(() => undefined);
};

function getTag(version: string | undefined): string {
  const prereleaseVersions: null | ReadonlyArray<string> = prerelease(version || '');
  return prereleaseVersions ? prereleaseVersions[0] : 'latest';
}

export async function createPackagePublishOptions({entry, cwd, getRemotePackageJson = getNpmRemotePackageJson}: {entry: string[], cwd: string, getRemotePackageJson?: GetRemotePackageJson}): Promise<PackagePublishOption[]> {
  const packageDirectory: string = path.join(cwd, 'dist/packages');
  
  if (!fs.pathExistsSync(packageDirectory) || !fs.statSync(packageDirectory).isDirectory()) {
    throw new Error(`"${packageDirectory}" directory is undefined`);
  }
  
  const currentPackageJsons: PackageJson[] = entry
    .map(packageName => path.join(packageDirectory, packageName, 'package.json'))
    .filter(packageJsonFile => fs.existsSync(packageJsonFile))
    .map(packageJsonFile => fs.readJsonSync(packageJsonFile))
    .filter(({name}) => typeof name === 'string');
  
  const remotePackageJsons: (PackageJson | undefined)[] = await Promise.all<PackageJson | undefined>(
    currentPackageJsons.map(({name, version}) => {
      return getRemotePackageJson({
        name: name!,
        version: getTag(version),
        fullMetadata: true,
      });
    }));
  
  return currentPackageJsons.map((currentPackageJson, i) => ({
    name: currentPackageJson.name!,
    currentPackageJson,
    remotePackageJson: remotePackageJsons[i],
    tag: getTag(currentPackageJson.version),
  }));
}