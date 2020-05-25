import { requireTypescript } from '@ssen/require-typescript';
import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';
import { PackageInfo, packageJsonFactoryFileName, PackageJsonTransformFile } from '../rule';

interface Params {
  packageDir: string;
  packageInfo: PackageInfo;
  dependencies: PackageJson.Dependency;
  sharedConfig?: PackageJson;
}

export async function computePackageJson({
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

  return fs.existsSync(factoryFile)
    ? requireTypescript<PackageJsonTransformFile>(factoryFile).defualt(computedConfig)
    : computedConfig;
}
