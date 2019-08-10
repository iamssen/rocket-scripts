import chalk from 'chalk';
import path from 'path';
import { getInternalPackageEntry } from '../internalPackage/getInternalPackageEntry';
import { sayTitle } from '../utils/sayTitle';
import { validatePackage } from './validatePackage';

export async function validatePackages({cwd}: {cwd: string}) {
  const entry: string[] = await getInternalPackageEntry({packageDir: path.join(cwd, 'src/_packages')});
  
  for await (const name of entry) {
    sayTitle('VALIDATE PACKAGE - ' + name);
    
    const validation: Error[] | undefined = await validatePackage({
      name,
      packageDir: path.join(cwd, 'src/_packages', name),
    });
    
    if (validation) {
      for (const v of validation) {
        console.error(chalk.red.bold(v.message));
      }
    }
  }
}