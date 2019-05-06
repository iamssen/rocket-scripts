import fs from 'fs-extra';
import path from 'path';

export async function copyServerPackageJson({cwd, copyTo}: {cwd: string, copyTo: string}) {
  const {dependencies} = await fs.readJson(path.join(cwd, 'package.json'));
  await fs.mkdirp(path.dirname(copyTo));
  await fs.writeJson(copyTo, {dependencies}, {encoding: 'utf8'});
}