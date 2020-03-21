import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';
import { getPackageJsonContentsOrderedNames } from '../transpile/getPackageJsonContentsOrderedNames';
import { PackageBuildOption } from '../types';
import { glob } from '../utils/glob-promise';

export async function createPackageBuildOptions({
  entry,
  cwd,
}: {
  entry: string[];
  cwd: string;
}): Promise<PackageBuildOption[]> {
  const packageJsonContents: PackageJson[] = await Promise.all(
    entry.map(packageName => fs.readJson(path.join(cwd, `src/_packages/${packageName}/package.json`))),
  );
  const orderedNames: string[] = getPackageJsonContentsOrderedNames({ packageJsonContents });
  const externals: string[] = [];

  const buildOptions: PackageBuildOption[] = [];

  for (const name of orderedNames) {
    const indexFileSearchResult: string[] = await glob(`${cwd}/src/_packages/${name}/index.{js,jsx,ts,tsx}`);

    if (indexFileSearchResult.length === 0) {
      throw new Error(`Undefined index file on "${cwd}/src/_packages/${name}"`);
    } else if (indexFileSearchResult.length > 1) {
      throw new Error(`Only one index file must exist : "${indexFileSearchResult.join(', ')}"`);
    }

    const file: string = indexFileSearchResult[0];

    buildOptions.push({
      name,
      file,
      buildTypescriptDeclaration: /\.tsx?$/.test(file),
      externals: [...externals],
    });

    externals.push(name);
  }

  return buildOptions;
}
