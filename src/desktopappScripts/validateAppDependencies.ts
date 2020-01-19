import semver from 'semver';
import { PackageJson } from 'type-fest';

interface Params {
  projectPackageJson: PackageJson;
  appPackageJson: PackageJson;
}

export function validateAppDependencies({
                                          projectPackageJson,
                                          appPackageJson: {dependencies},
                                        }: Params) {
  if (dependencies && projectPackageJson.dependencies) {
    for (const name of Object.keys(dependencies)) {
      if (!projectPackageJson.dependencies[name]) {
        throw new Error(`"${name}" is undefined in projectPackageJson`);
      }
      
      const a: string = dependencies[name];
      const b: string = projectPackageJson.dependencies[name];
      
      if (!semver.intersects(a, b)) {
        throw new Error(`The versions of "${name}" are not intersects`);
      }
    }
  }
}