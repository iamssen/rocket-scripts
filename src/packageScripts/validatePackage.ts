import { findInternalPackageMissingDependencies } from '../internalPackage/findInternalPackageMissingDependencies';

export async function validatePackage({name, packageDir}: {name: string, packageDir: string}) {
  const missingPackages: string[] = await findInternalPackageMissingDependencies({packageDir});
  
  if (missingPackages.length > 0) {
    throw new Error(`There are dependencies imported inside package "${name}" but not added to "${name}/package.json". please add ${missingPackages.map(p => '"' + p + '"').join(', ')} to "${name}/package.json".`);
  }
}