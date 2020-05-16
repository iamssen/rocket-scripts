import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';
import { packageJsonFactoryFileName } from '../rule/fileNames';
import { PackageInfo } from '../types';

interface Params {
  packageDir: string;
  packageInfo: PackageInfo;
  dependencies: PackageJson.Dependency;
  sharedConfig?: PackageJson;
}

export function computePackageJson({
  packageDir,
  packageInfo,
  dependencies,
  sharedConfig = {},
}: Params): Promise<PackageJson> {
  const shared: PackageJson = { ...sharedConfig };

  Object.keys(shared).forEach((key) => {
    const value: unknown = shared[key];
    if (typeof value === 'string') {
      shared[key] = value
        .replace(/({name})/g, packageInfo.name) // {name}
        .replace(/({version})/g, packageInfo.version); // {version}
    }
  });

  const computedConfig: PackageJson = {
    ...shared,

    name: packageInfo.name,
    version: packageInfo.version,
    dependencies: dependencies,
    main: 'index.js',
    typings: 'index.d.ts',
  };

  const factoryFile: string = path.join(packageDir, packageJsonFactoryFileName);

  return fs.existsSync(factoryFile) ? require(factoryFile)(computedConfig) : computedConfig;
}
