import fs from 'fs-extra';
import path from 'path';
import { intersects } from 'semver';
import { PackageJson } from 'type-fest';
import { getInternalPackageEntry } from '../internalPackage/getInternalPackageEntry';

export async function findMissingDependencies({cwd}: {cwd: string}): Promise<PackageJson.Dependency> {
  const hostPackageJson: PackageJson = await fs.readJson(path.join(cwd, 'package.json'));
  
  const entry: string[] = getInternalPackageEntry({packageDir: path.join(cwd, 'src/_packages')});
  
  const modulePackageJsons: PackageJson[] = await Promise.all(entry.map(packageName => fs.readJson(path.join(cwd, 'src/_packages', packageName, 'package.json'))));
  
  const hostDependencies: PackageJson.Dependency = hostPackageJson.dependencies || {};
  const moduleDependencies: PackageJson.Dependency = Object.assign({}, ...modulePackageJsons.map(({dependencies}) => dependencies));
  
  for (const packageName of entry) {
    if (moduleDependencies[packageName]) {
      delete moduleDependencies[packageName];
    }
  }
  
  for (const packageName of Object.keys(moduleDependencies)) {
    if (hostDependencies[packageName]) {
      if (!intersects(hostDependencies[packageName], moduleDependencies[packageName])) {
        throw new Error(`${packageName}@${hostDependencies[packageName]} of package.json and ${packageName}@${moduleDependencies[packageName]} are not intersects!`);
      }
    }
  }
  
  const missingDependencies: PackageJson.Dependency = {...moduleDependencies};
  
  for (const packageName of Object.keys(missingDependencies)) {
    if (hostDependencies[packageName]) {
      delete missingDependencies[packageName];
    }
  }
  
  return missingDependencies;
}