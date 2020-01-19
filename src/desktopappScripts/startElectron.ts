import fs from 'fs-extra';
import nodemon from 'nodemon';
import path from 'path';
import { copyElectronPackageJson } from './copyElectronPackageJson';
import { watingFiles } from '../runners/watingFiles';
import { DesktopappConfig } from '../types';
import { sayTitle } from '../utils/sayTitle';

export async function startElectron({
                                      cwd,
                                      app,
                                      output,
                                    }: DesktopappConfig) {
  const file: string = path.join(output, 'electron/main.js');
  const dir: string = path.join(output, 'electron');
  
  await watingFiles([file]);
  
  if (!fs.pathExistsSync(path.join(output, 'electron/node_modules'))) {
    await fs.mkdirp(dir);
    await fs.symlink(path.join(cwd, 'node_modules'), path.join(output, 'electron/node_modules'));
  }
  
  sayTitle('START ELECTRON');
  
  await copyElectronPackageJson({
    file: path.join(cwd, 'package.json'),
    app: path.join(cwd, 'src', app, 'package.json'),
    copyTo: path.join(output, 'electron/package.json'),
  });
  
  nodemon({
    watch: [file],
    exec: `electron ${dir}`,
  });
}