import fs from 'fs-extra';
import path from 'path';
import { getInternalPackagePublicDrectories } from '../internalPackage/getInternalPackagePublicDrectories';
import { WebappArgv } from '../types';

export async function getStaticFileDirectories({argv, cwd}: {argv: WebappArgv, cwd: string}): Promise<string[]> {
  const staticFileDirectories: string[] = [];
  
  if (typeof argv.staticFileDirectories === 'string') {
    const manualDirectories: string[] = argv.staticFileDirectories.split(' ')
      .map(directory => path.join(cwd, directory));
    
    staticFileDirectories.push(...manualDirectories);
  } else {
    const publicDirectory: string = path.join(cwd, 'public');
    
    if (fs.pathExistsSync(publicDirectory) && fs.statSync(publicDirectory).isDirectory()) {
      staticFileDirectories.push(publicDirectory);
    }
    
    const internalPackageDirectories: string[] = await getInternalPackagePublicDrectories({packageDir: path.join(cwd, 'src/_packages')});
    
    staticFileDirectories.push(...internalPackageDirectories);
  }
  
  if (typeof argv.staticFilePackages === 'string') {
    const packageDirectories: string[] = argv.staticFilePackages.split(' ')
      .map(packageName => {
        const paths: string[] = [
          ...(require.resolve.paths(packageName) || []),
          path.join(cwd, 'node_modules'),
        ];
        const packageJson: string = require.resolve(`${packageName}/package.json`, {paths});
        return path.join(path.dirname(packageJson), 'public');
      })
      .filter(directory => fs.pathExistsSync(directory) && fs.statSync(directory).isDirectory());
    
    staticFileDirectories.push(...packageDirectories);
  }
  
  return staticFileDirectories;
}