import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';

interface Params {
  cwd: string;
}

export async function getRootDependencies({ cwd }: Params): Promise<PackageJson.Dependency> {
  const packageJson: PackageJson = await fs.readJson(path.join(cwd, 'package.json'));

  return {
    ...packageJson.devDependencies,
    ...packageJson.dependencies,
  };
}
