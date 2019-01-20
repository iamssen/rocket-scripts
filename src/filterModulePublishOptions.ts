import { ModulePublishOption } from './types';
import prompts from 'prompts';
import semver from 'semver';

export = function (publishOptions: ModulePublishOption[]): Promise<ModulePublishOption[]> {
  return prompts({
    type: 'multiselect',
    name: 'publishOptions',
    message: 'Select modules to pubblish',
    choices: publishOptions.map(({name, remoteVersion, workingVersion}) => {
      const cannotPublish: boolean = Boolean(remoteVersion && semver.lte(workingVersion, remoteVersion));
      return {
        title: remoteVersion
          ? `${name} (${remoteVersion} → ${workingVersion})`
          : `${name} (→ ${workingVersion})`,
        value: name,
        disabled: cannotPublish,
      };
    }),
  }).then(answer => {
    const filter: Set<string> = new Set(answer.publishOptions);
    return publishOptions.filter(publishOption => filter.has(publishOption.name));
  });
}