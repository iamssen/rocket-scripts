import { AvailablePublishOption, getPublishOptions, PublishOption, selectPublishOptions } from '@ssen/publish-packages';
import path from 'path';
import { getPackagesEntry } from './entry/getPackagesEntry';
import { PackageInfo } from './rule';

export type PublishMessages =
  | {
      type: 'exec';
      command: string;
      publishOption: AvailablePublishOption;
    }
  | {
      type: 'error';
      errors: Error[];
    };

export interface PublishParams {
  cwd: string;

  outDir: string;

  /** skip user selection of packages to publish */
  skipSelection?: boolean;
  registry?: string;
  tag?: string;

  onMessage: (message: PublishMessages) => Promise<void>;
}

export async function publish({ cwd, outDir, skipSelection = false, registry, tag, onMessage }: PublishParams) {
  try {
    const entry: Map<string, PackageInfo> = await getPackagesEntry({ cwd });
    const publishOptions: Map<string, PublishOption> = await getPublishOptions({
      entry,
      outDir,
      registry,
      tag,
    });
    const selectedPublishOptions: AvailablePublishOption[] = await selectPublishOptions({
      publishOptions,
      skipSelection,
    });

    for (const publishOption of selectedPublishOptions) {
      const t: string = ` --tag ${tag || publishOption.tag}`;
      const r: string = registry ? ` --registry "${registry}"` : '';

      const command: string =
        process.platform === 'win32'
          ? `cd "${path.join(outDir, publishOption.name)}" && npm publish${t}${r}`
          : `cd "${path.join(outDir, publishOption.name)}"; npm publish${t}${r};`;

      await onMessage({
        type: 'exec',
        command,
        publishOption,
      });

      //const { stderr, stdout } = await exec(command, { encoding: 'utf8' });
      //console.log(stdout);
      //console.error(stderr);
    }
  } catch (error) {
    await onMessage({
      type: 'error',
      errors: [error],
    });
  }
}
