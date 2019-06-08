import prompts, { Answers } from 'prompts';
import semver from 'semver';
import { PackagePublishOption } from '../types';

export async function selectPublishOptions({publishOptions}: {publishOptions: PackagePublishOption[]}): Promise<PackagePublishOption[]> {
  const answer: Answers<'publishOptions'> = await prompts<'publishOptions'>({
    type: 'multiselect',
    name: 'publishOptions',
    message: 'Select packages to publish',
    choices: publishOptions.map(({name, tag, currentPackageJson, remotePackageJson}) => {
      const currentVersion: string = currentPackageJson.version!;
      const remoteVersion: string | undefined = remotePackageJson && typeof remotePackageJson.version === 'string' ? remotePackageJson.version : undefined;
      
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
  
  return publishOptions.filter(publishOption => filter.has(publishOption.name));
}