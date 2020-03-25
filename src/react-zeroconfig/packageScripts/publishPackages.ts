import path from 'path';
import { getInternalPackageEntry } from '../internalPackage/getInternalPackageEntry';
import { PackagePublishOption } from '../types';
import { exec } from '../utils/exec-promise';
import { sayTitle } from '../utils/sayTitle';
import { createPackagePublishOptions } from './createPackagePublishOptions';
import { selectPublishOptions } from './selectPublishOptions';

export async function publishPackages({ cwd, choice }: { cwd: string; choice: boolean }) {
  try {
    const entry: string[] = getInternalPackageEntry({ packageDir: path.join(cwd, 'src/_packages') });
    const publishOptions: PackagePublishOption[] = await createPackagePublishOptions({ entry, cwd });

    sayTitle('SELECT PACKAGES TO PUBLISH');
    const selectedPublishOptions: PackagePublishOption[] = await selectPublishOptions({ publishOptions, choice });

    for await (const publishOption of selectedPublishOptions) {
      sayTitle('PUBLISH PACKAGE - ' + publishOption.name);
      console.log(`npm publish ${publishOption.name} --tag ${publishOption.tag}`);
      console.log('');

      const command: string =
        process.platform === 'win32'
          ? `cd "${path.join(cwd, 'dist/packages', publishOption.name)}" && npm publish --tag ${publishOption.tag}`
          : `cd "${path.join(cwd, 'dist/packages', publishOption.name)}"; npm publish --tag ${publishOption.tag};`;

      const { stderr, stdout } = await exec(command, { encoding: 'utf8' });
      console.log(stdout);
      console.error(stderr);
    }
  } catch (error) {
    sayTitle('⚠️ PUBLISH PACKAGES ERROR');
    console.error(error);
  }
}
