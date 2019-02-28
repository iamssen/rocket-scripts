import fs from 'fs-extra';
import path from 'path';
import { Config } from '../../types';

interface Params {
  appDirectory: Config['appDirectory'];
  outputPath: string;
}

export = function ({appDirectory, outputPath}: Params): Promise<void> {
  return new Promise((resolve: () => void) => {
    const {name, dependencies} = fs.readJsonSync(path.join(appDirectory, 'package.json'));
    
    fs.mkdirpSync(path.dirname(outputPath));
    
    fs.writeJsonSync(
      outputPath,
      {
        name,
        dependencies,
      },
      {encoding: 'utf8'},
    );
    
    resolve();
  });
}