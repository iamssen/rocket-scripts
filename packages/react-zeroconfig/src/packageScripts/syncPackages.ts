import { PackageJson } from 'type-fest';
import { sayTitle } from '../utils/sayTitle';
import { findMissingDependencies } from './findMissingDependencies';

export async function syncPackages({ cwd }: { cwd: string }) {
  const missingDependencies: PackageJson.Dependency = await findMissingDependencies({ cwd });

  if (Object.keys(missingDependencies).length > 0) {
    //const nextDependencies: PackageJson.Dependency = {
    //  ...hostDependencies,
    //  ...diffDependencies,
    //};
    //const nextPackageJson: PackageJson = {...hostPackageJson};
    //nextPackageJson.dependencies = nextDependencies;
    //
    //await fs.writeJson(path.join(cwd, 'package.json'), nextPackageJson, {encoding: 'utf8'});
    sayTitle('ADD TO ROOT PACKAGE.JSON');
    console.log(JSON.stringify({ dependencies: missingDependencies }, null, 2));
  }
}
