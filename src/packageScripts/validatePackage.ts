import { findInternalPackageMissingDependencies } from '../internalPackage/findInternalPackageMissingDependencies';

export async function validatePackage({name, packageDir}: {name: string, packageDir: string}): Promise<Error[] | undefined> {
  const missingPackages: Set<string> | undefined = await findInternalPackageMissingDependencies({packageDir});
  
  if (missingPackages) {
    const errors: Error[] = [];
    
    if (missingPackages.has(name)) {
      errors.push(new Error(`Don't import "${name}" itself inside "${name}"`));
      missingPackages.delete(name);
    }
    
    if (missingPackages.size > 0) {
      errors.push(new Error(`There are dependencies imported inside package "${name}" but not added to "${name}/package.json". please add ${Array.from(missingPackages).map(p => '"' + p + '"').join(', ')} to "${name}/package.json".`));
    }
    
    return errors;
  }
  
  return undefined;
}