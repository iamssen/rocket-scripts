import fs from 'fs-extra';
import nodemon from 'nodemon';
import path from 'path';
import { watingFiles } from '../runners/watingFiles';
import { WebappConfig } from '../types';
import { sayTitle } from '../utils/sayTitle';

// work
// - [x] wating output/server/index.js
// - [x] create symlink node_modules
// - [x] start nodemon with output/server/index.js
// staticFileDirectories
// - none of effect to this task
// sizeReport
// - none of effect to this task
// mode
// - none of effect to this task
// output
// - [x] output/server
// appFileName
// - none of effect to this task
// vendorFileName
// - none of effect to this task
// styleFileName
// - none of effect to this task
// chunkPath
// - none of effect to this task
// publicPath
// - none of effect to this task
// port
// - none of effect to this task
// serverPort
// - none of effect to this task
// https
// - none of effect to this task
// extend.serverSideRendering
// - none of effect to this task
// extend.templateFiles
// - none of effect to this task
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