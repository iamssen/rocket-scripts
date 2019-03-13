import fs from 'fs-extra';
import getPackageJson, { AbbreviatedMetadata, AbbreviatedVersion } from 'package-json';
import path from 'path';
import { Config, ModulePublishOption } from '../../types';

interface Params {
  version: string;
  appDirectory: Config['appDirectory'];
  modules: Config['modules']['entry'];
  getRemoteVersion?: (name: string, version: string) => Promise<ModulePublishOption['remoteVersion']>;
}

interface PackageJsonContent {
  name: string;
  version: string;
}

function getNpmRemoteVersion(name: string, version: string): Promise<ModulePublishOption['remoteVersion']> {
  return getPackageJson(name, {version})
    .then((value: AbbreviatedMetadata) => {
      return value && typeof value.version === 'string' ? value.version : undefined;
    })
    .catch(() => {
      return undefined;
    });
}

export = function ({modules, appDirectory, version, getRemoteVersion = getNpmRemoteVersion}: Params): Promise<ModulePublishOption[]> {
  const modulesDirectory: string = path.join(appDirectory, 'dist/modules');
  
  if (!fs.existsSync(modulesDirectory) || !fs.statSync(modulesDirectory).isDirectory()) {
    return Promise.reject(new Error(`"${modulesDirectory}" directory is undefined`));
  }
  
  return Promise.all<ModulePublishOption>(
    modules
      .map((moduleName: string) => {
        return path.join(modulesDirectory, moduleName, 'package.json');
      })
      .filter((packageJsonPath: string) => {
        return fs.existsSync(packageJsonPath);
      })
      .map((packageJsonPath: string) => {
        const workingPackageJson: PackageJsonContent = fs.readJsonSync(packageJsonPath) as PackageJsonContent;
        
        return {
          name: workingPackageJson.name,
          workingVersion: workingPackageJson.version,
        };
      })
      .map(({name, workingVersion}: {name: string, workingVersion: string}) => {
        return getRemoteVersion(name, version).then((remoteVersion: string) => {
          return {
            name,
            workingVersion,
            remoteVersion,
          };
        });
      }),
  );
}