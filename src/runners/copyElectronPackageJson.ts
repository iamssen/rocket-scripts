import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';

export async function copyElectronPackageJson({file, app, copyTo}: {file: string, app: string, copyTo: string}) {
  const {dependencies, devDependencies} = await fs.readJson(file);
  const appPackageJson: PackageJson = (await fs.pathExistsSync(app))
    ? await fs.readJson(app)
    : {};
  await fs.mkdirp(path.dirname(copyTo));
  const content: object = {
    main: 'main.js',
    dependencies,
    devDependencies,
    ...appPackageJson,
  };
  await fs.writeJson(copyTo, content, {encoding: 'utf8'});
}