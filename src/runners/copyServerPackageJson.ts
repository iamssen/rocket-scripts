import fs from 'fs-extra';
import path from 'path';

export async function copyServerPackageJson({file, copyTo}: {file: string, copyTo: string}) {
  const {dependencies} = await fs.readJson(file);
  await fs.mkdirp(path.dirname(copyTo));
  await fs.writeJson(copyTo, {dependencies}, {encoding: 'utf8'});
}