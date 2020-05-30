import prompts, { Answers } from 'prompts';
import semver from 'semver';
import { PublishOption } from './types';

export function getVersions({
  current,
  remote,
}: PublishOption): { currentVersion: string; remoteVersion: string | undefined } {
  const currentVersion: string = current.version!;
  const remoteVersion: string | undefined = remote && typeof remote.version === 'string' ? remote.version : undefined;
  return { currentVersion, remoteVersion };
}

interface Params {
  publishOptions: Map<string, PublishOption>;
  skipSelection: boolean;
}

export async function selectPublishOptions({ publishOptions, skipSelection }: Params): Promise<PublishOption[]> {
  if (skipSelection) {
    // no remote package
    // or build version is higher than remote version
    const availablePublishOptions: PublishOption[] = Array.from(publishOptions.values()).filter((publishOption) => {
      const { currentVersion, remoteVersion } = getVersions(publishOption);
      return !remoteVersion || semver.gt(currentVersion, remoteVersion);
    });

    if (availablePublishOptions.length > 0) {
      for (const publishOption of availablePublishOptions) {
        const { name, tag } = publishOption;
        const { currentVersion, remoteVersion } = getVersions(publishOption);

        const title: string = remoteVersion
          ? `${name}@${tag} (${remoteVersion} → ${currentVersion})`
          : `${name}@${tag} (→ ${currentVersion})`;

        console.log(title);
      }
    }

    return availablePublishOptions;
  } else {
    const answer: Answers<'publishOptions'> = await prompts<'publishOptions'>({
      type: 'multiselect',
      name: 'publishOptions',
      message: 'Select packages to publish',
      choices: Array.from(publishOptions.values()).map((publishOption) => {
        const { name, tag } = publishOption;
        const { currentVersion, remoteVersion } = getVersions(publishOption);

        return {
          title: remoteVersion
            ? `${name}@${tag} (${remoteVersion} → ${currentVersion})`
            : `${name}@${tag} (→ ${currentVersion})`,
          value: name,
          disabled: remoteVersion && semver.lte(currentVersion, remoteVersion),
        };
      }),
    });

    const filter: Set<string> = new Set(answer.publishOptions);

    return Array.from(publishOptions.values()).filter((publishOption) => filter.has(publishOption.name));
  }
}
