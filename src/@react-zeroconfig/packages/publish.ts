import { getPackagesEntry } from '@react-zeroconfig/packages/entry/getPackagesEntry';
import { exec } from '@ssen/promised';
import { getPublishOptions, PublishOption, selectPublishOptions } from '@ssen/publish-packages';
import path from 'path';
import { PackageInfo } from './rule';

interface Params {
  cwd: string;
  outDir: string;
  force?: boolean;
  registry?: string;
  tag?: string;
}

export async function publish({ cwd, outDir, force = false, registry, tag }: Params) {
  try {
    const entry: Map<string, PackageInfo> = await getPackagesEntry({ cwd });
    const publishOptions: Map<string, PublishOption> = await getPublishOptions({
      entry,
      outDir,
      registry,
      tag,
    });
    const selectedPublishOptions: PublishOption[] = await selectPublishOptions({
      publishOptions,
      force,
    });

    for (const publishOption of selectedPublishOptions) {
      const t: string = ` --tag ${tag || publishOption.tag}`;
      const r: string = registry ? ` --registry "${registry}"` : '';

      console.log(`npm publish ${publishOption.name}${t}${r}`);
      console.log('');

      const command: string =
        process.platform === 'win32'
          ? `cd "${path.join(cwd, 'dist', publishOption.name)}" && npm publish${t}${r}`
          : `cd "${path.join(cwd, 'dist', publishOption.name)}"; npm publish${t}${r};`;

      const { stderr, stdout } = await exec(command, { encoding: 'utf8' });
      console.log(stdout);
      console.error(stderr);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
