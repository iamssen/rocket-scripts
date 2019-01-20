import fs from 'fs-extra';
import getPackageJson from 'package-json';
import path from 'path';
import { Config, ModulePublishOption } from './types';

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
    .then(packageJson => {
      return packageJson.version;
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
      .map(moduleName => {
        return path.join(modulesDirectory, moduleName, 'package.json');
      })
      .filter(packageJsonPath => {
        return fs.existsSync(packageJsonPath);
      })
      .map(packageJsonPath => {
        const workingPackageJson: PackageJsonContent = fs.readJsonSync(packageJsonPath) as PackageJsonContent;
        
        return {
          name: workingPackageJson.name,
          workingVersion: workingPackageJson.version,
        };
      })
      .map(({name, workingVersion}) => {
        return getRemoteVersion(name, version).then(remoteVersion => {
          return {
            name,
            workingVersion,
            remoteVersion,
          };
        });
      }),
  );
}