import { execSync } from 'child_process';
import path from 'path';
import { Config, ModulePublishOption } from '../../types';

interface Params {
  publishOptions: ModulePublishOption[];
  appDirectory: Config['appDirectory'];
  exec?: (command: string) => string;
}

export = function ({publishOptions, appDirectory, exec = execSync}: Params): Promise<void> {
  return new Promise((resolve: () => void, reject: (error: Error) => void) => {
    let i: number = -1;
    
    function func() {
      if (++i < publishOptions.length) {
        const {name} = publishOptions[i];
        try {
          console.log(exec(
            process.platform === 'win32'
              ? `cd "${path.join(appDirectory, 'dist/modules', name)}" && npm publish`
              : `cd "${path.join(appDirectory, 'dist/modules', name)}"; npm publish;`,
          ));
          func();
        } catch (error) {
          reject(error);
        }
      } else {
        resolve();
      }
    }
    
    func();
  });
}