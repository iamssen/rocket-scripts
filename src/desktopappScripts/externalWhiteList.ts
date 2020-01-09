import fs from 'fs-extra';
import path from 'path';

export function externalWhiteList({cwd, app}: {cwd: string, app: string}): (string | RegExp)[] {
  const file: string = path.join(cwd, 'src', app, 'external-whitelist.js');
  return fs.pathExistsSync(file) ? require(file) : [];
}