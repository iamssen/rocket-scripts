import fs from 'fs-extra';
import path from 'path';

export async function copyElectronPackageJson({file, copyTo}: {file: string, copyTo: string}) {
  const {dependencies, devDependencies} = await fs.readJson(file);
  await fs.mkdirp(path.dirname(copyTo));
  const content: object = {
    main: 'main.js',
    dependencies,
    devDependencies,
  };
  await fs.writeJson(copyTo, content, {encoding: 'utf8'});
}