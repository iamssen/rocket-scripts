import fs from 'fs-extra';
import { PackageJson } from 'type-fest';

export async function getPackageJsonBrowserslistQuery({packageJson}: {packageJson: string}): Promise<string | string[] | undefined> {
  const {browserslist}: PackageJson = await fs.readJson(packageJson, {encoding: 'utf8'});
  
  if (typeof browserslist === 'string' || Array.isArray(browserslist)) {
    return browserslist;
  }
  
  return undefined;
}