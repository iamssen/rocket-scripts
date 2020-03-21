import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';

export function getRendererExternals({ cwd, app }: { cwd: string; app: string }): (string | RegExp)[] {
  const file: string = path.join(cwd, 'src', app, 'package.json');
  const packageJson: PackageJson = fs.readJsonSync(file);
  return packageJson.dependencies ? Object.keys(packageJson.dependencies) : [];
}
