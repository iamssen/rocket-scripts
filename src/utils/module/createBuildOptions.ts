import fs from 'fs-extra';
import path from 'path';
import { Config, ModuleBuildOption } from '../../types';
import sortPackagJsonFiles from './sortPackageJsonFiles';

interface Params {
  appDirectory: Config['appDirectory'];
  modules: Config['modules']['entry'];
}

interface PackageJsonContent {
  name: string;
  dependencies?: {[name: string]: string};
}

export = function ({modules, appDirectory}: Params): Promise<ModuleBuildOption[]> {
  const packageJsonContents: PackageJsonContent[] = modules.map((moduleName: string) => {
    return fs.readJsonSync(path.join(appDirectory, `src/_modules/${moduleName}/package.json`));
  });
  
  const sortedModuleNames: string[] = sortPackagJsonFiles(packageJsonContents);
  const externals: string[] = [];
  
  const buildOptions: ModuleBuildOption[] = [];
  
  for (const moduleName of sortedModuleNames) {
    const indexFile: string | undefined = fs.existsSync(path.join(appDirectory, `src/_modules/${moduleName}/index.tsx`))
      ? 'index.tsx'
      : fs.existsSync(path.join(appDirectory, `src/_modules/${moduleName}/index.ts`))
        ? 'index.ts'
        : fs.existsSync(path.join(appDirectory, `src/_modules/${moduleName}/index.jsx`))
          ? 'index.jsx'
          : fs.existsSync(path.join(appDirectory, `src/_modules/${moduleName}/index.js`))
            ? 'index.js'
            : undefined;
    
    if (!indexFile) continue;
    
    const declaration: boolean = /\.tsx?$/.test(indexFile);
    
    const file: string = path.join(appDirectory, `src/_modules/${moduleName}/${indexFile}`);
    
    const buildOption: ModuleBuildOption = {
      name: moduleName,
      file,
      declaration,
      externals: externals.slice(),
    };
    
    externals.push(moduleName);
    
    buildOptions.push(buildOption);
  }
  
  return Promise.resolve(buildOptions);
}