import prompts, { Answers } from 'prompts';
import semver from 'semver';
import { PackagePublishOption } from '../types';

export function getVersions({
  currentPackageJson,
  remotePackageJson,
}: PackagePublishOption): { currentVersion: string; remoteVersion: string | undefined } {
  const currentVersion: string = currentPackageJson.version!;
  const remoteVersion: string | undefined =
    remotePackageJson && typeof remotePackageJson.version === 'string' ? remotePackageJson.version : undefined;
  return { currentVersion, remoteVersion };
}

export async function selectPublishOptions({
  publishOptions,
  choice,
}: {
  publishOptions: PackagePublishOption[];
  choice: boolean;
}): Promise<PackagePublishOption[]> {
  if (!choice) {
    const availablePublishOptions: PackagePublishOption[] = publishOptions.filter((publishOption) => {
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
  }

  const answer: Answers<'publishOptions'> = await prompts<'publishOptions'>({
    type: 'multiselect',
    name: 'publishOptions',
    message: 'Select packages to publish',
    choices: publishOptions.map((publishOption) => {
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

  return publishOptions.filter((publishOption) => filter.has(publishOption.name));
}
