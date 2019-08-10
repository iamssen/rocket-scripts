import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';
import { getInternalPackageEntry } from '../internalPackage/getInternalPackageEntry';
import { sayTitle } from '../utils/sayTitle';

export async function listPackages({cwd}: {cwd: string}) {
  const entry: string[] = await getInternalPackageEntry({packageDir: path.join(cwd, 'src/_packages')});
  
  const n: (name: string) => string = name => {
    return entry.indexOf(name) > -1
      ? chalk.bold.blue(name)
      : name;
  };
  
  function nv(name: string, version: string | undefined): string {
    return n(name) + chalk.green('@' + version);
  }
  
  function tree(name: string, dependencies: PackageJson.Dependency | undefined) {
    if (dependencies) {
      console.log(chalk.gray('└── ') + n(name));
      
      const packageNames: string[] = Object.keys(dependencies);
      
      packageNames.forEach((packageName, i) => {
        if (i === packageNames.length - 1) {
          console.log(chalk.gray(`    └── `) + nv(packageName, dependencies[packageName]));
        } else {
          console.log(chalk.gray(`    ├── `) + nv(packageName, dependencies[packageName]));
        }
      });
    }
  }
  
  sayTitle('LIST DEPENDENCIES');
  
  for await (const name of entry) {
    const {version, dependencies, devDependencies, peerDependencies, optionalDependencies}: PackageJson = await fs.readJsonSync(path.join(cwd, 'src/_packages', name, 'package.json'));
    console.log(nv(name, version));
    tree('dependencies', dependencies);
    tree('devDependencies', devDependencies);
    tree('peerDependencies', peerDependencies);
    tree('optionalDependencies', optionalDependencies);
  }
}