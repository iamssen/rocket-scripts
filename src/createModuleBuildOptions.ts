import fs from 'fs-extra';
import sortPackagJsonFiles from './sortPackageJsonFiles';
import { Config, ModuleBuildOption } from './types';
import path from 'path';

interface Params {
  appDirectory: Config['appDirectory'];
  modules: {[name: string]: {group?: string}}
}

export = function ({modules, appDirectory}: Params): Promise<ModuleBuildOption[]> {
  const packageJsonFiles: {name: string, dependencies?: {[name: string]: string}}[] = Object.keys(modules).map(name => {
    const groupDirectory: string = modules[name].group ? modules[name].group + '/' : '';
    return fs.readJsonSync(path.join(appDirectory, `src/_modules/${groupDirectory}${name}`));
  });
  
  const sortedModuleNames: string[] = sortPackagJsonFiles(packageJsonFiles);
  const externals: string[] = [];
  
  const buildOptions: ModuleBuildOption[] = sortedModuleNames.map(name => {
    const group: string | undefined = modules[name].group;
    const groupDirectory: string = group ? group + '/' : '';
    const indexFile: string = fs.existsSync(path.join(appDirectory, `src/_modules/${groupDirectory}${name}/index.tsx`))
      ? 'index.tsx'
      : 'index.ts';
    const file: string = path.join(appDirectory, `src/_modules/${groupDirectory}${name}/${indexFile}`);
    
    const buildOption: ModuleBuildOption = {
      name,
      group,
      groupDirectory,
      file,
      externals: externals.slice(),
    };
    
    externals.push(`${groupDirectory}${name}`);
    
    return buildOption;
  });
  
  return Promise.resolve(buildOptions);
}