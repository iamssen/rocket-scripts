import path from 'path';
import { getInternalPackageEntry } from '../internalPackage/getInternalPackageEntry';
import { PackagePublishOption } from '../types';
import { exec } from '../utils/exec-promise';
import { sayTitle } from '../utils/sayTitle';
import { createPackagePublishOptions } from './createPackagePublishOptions';
import { selectPublishOptions } from './selectPublishOptions';

export async function publishPackages({cwd}: {cwd: string}) {
  try {
    const entry: string[] = await getInternalPackageEntry({packageDir: path.join(cwd, 'src/_packages')});
    const publishOptions: PackagePublishOption[] = await createPackagePublishOptions({entry, cwd, version: 'latest'});
    
    sayTitle('SELECT PACKAGES TO PUBLISH');
    const selectedPublishOptions: PackagePublishOption[] = await selectPublishOptions({publishOptions});
    
    for await (const publishOption of selectedPublishOptions) {
      sayTitle('PUBLISH PACKAGE - ' + publishOption.name);
      
      const command: string = process.platform === 'win32'
        ? `cd "${path.join(cwd, 'dist/packages', name)}" && npm publish`
        : `cd "${path.join(cwd, 'dist/packages', name)}"; npm publish;`;
      
      console.log(await exec(command, {encoding: 'utf8'}));
    }
  } catch (error) {
    sayTitle('⚠️ PUBLISH PACKAGES ERROR');
    console.error(error);
  }
}