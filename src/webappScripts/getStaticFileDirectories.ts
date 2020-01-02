import fs from 'fs-extra';
import path from 'path';
import { getInternalPackagePublicDrectories } from '../internalPackage/getInternalPackagePublicDrectories';

export async function getStaticFileDirectories({staticFileDirectories, staticFilePackages, cwd}: {staticFileDirectories?: string | undefined, staticFilePackages?: string | undefined, cwd: string}): Promise<string[]> {
  const directories: string[] = [];
  
  if (typeof staticFileDirectories === 'string') {
    const manualDirectories: string[] = staticFileDirectories.split(' ')
      .map(directory => path.join(cwd, directory));
    
    directories.push(...manualDirectories);
  } else {
    const publicDirectory: string = path.join(cwd, 'public');
    
    if (fs.pathExistsSync(publicDirectory) && fs.statSync(publicDirectory).isDirectory()) {
      directories.push(publicDirectory);
    }
    
    const internalPackageDirectories: string[] = await getInternalPackagePublicDrectories({packageDir: path.join(cwd, 'src/_packages')});
    
    directories.push(...internalPackageDirectories);
  }
  
  if (typeof staticFilePackages === 'string') {
    const packageDirectories: string[] = staticFilePackages.split(' ')
      .map(packageName => {
        const paths: string[] = [
          ...(require.resolve.paths(packageName) || []),
          path.join(cwd, 'node_modules'),
        ];
        const packageJson: string = require.resolve(`${packageName}/package.json`, {paths});
        return path.join(path.dirname(packageJson), 'public');
      })
      .filter(directory => fs.pathExistsSync(directory) && fs.statSync(directory).isDirectory());
    
    directories.push(...packageDirectories);
  }
  
  return directories;
}