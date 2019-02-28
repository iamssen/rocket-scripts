import fs from 'fs-extra';
import path from 'path';
import { Config, ModuleBuildOption } from '../../types';

interface Params {
  buildOption: ModuleBuildOption;
  appDirectory: Config['appDirectory'];
}

const filter: RegExp = /\.(ts|tsx|js|jsx)$/;

export = function ({buildOption, appDirectory}: Params): Promise<void> {
  //const publicPath: string = path.join(appDirectory, `src/_modules/${buildOption.name}/public`);
  //const outputPath: string = path.join(appDirectory, `dist/modules/${buildOption.name}/public`);
  //
  //if (!fs.existsSync(publicPath) || !fs.statSync(publicPath).isDirectory()) {
  //  return Promise.resolve();
  //}
  //
  //return fs.copy(publicPath, outputPath, {dereference: true});
  
  return fs.copy(
    path.join(appDirectory, `src/_modules/${buildOption.name}`),
    path.join(appDirectory, `dist/modules/${buildOption.name}`),
    {
      filter: (src: string) => !filter.test(src),
    },
  );
}