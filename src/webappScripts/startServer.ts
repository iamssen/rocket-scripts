import fs from 'fs-extra';
import nodemon from 'nodemon';
import path from 'path';
import { watingFiles } from '../runners/watingFiles';
import { WebappConfig } from '../types';
import { sayTitle } from '../utils/sayTitle';

export async function startServer({
                                    cwd,
                                    output,
                                  }: WebappConfig) {
  const file: string = path.join(output, 'server/index.js');
  const dir: string = path.join(output, 'server');
  
  await watingFiles([file]);
  
  if (!fs.pathExistsSync(path.join(output, 'server/node_modules'))) {
    await fs.mkdirp(dir);
    await fs.symlink(path.join(cwd, 'node_modules'), path.join(output, 'server/node_modules'));
  }
  
  sayTitle('START NODEMON');
  
  nodemon({
    watch: [dir],
    exec: `node -r ${path.dirname(require.resolve('source-map-support/package.json'))}/register ${file}`,
  });
}