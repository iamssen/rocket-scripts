import prompts, { Answers } from 'prompts';
import semver from 'semver';
import { ModulePublishOption } from './types';

export = function (publishOptions: ModulePublishOption[]): Promise<ModulePublishOption[]> {
  return prompts<'publishOptions'>({
    type: 'multiselect',
    name: 'publishOptions',
    message: 'Select modules to pubblish',
    choices: publishOptions.map(({name, remoteVersion, workingVersion}: ModulePublishOption) => {
      const cannotPublish: boolean = Boolean(remoteVersion && semver.lte(workingVersion, remoteVersion));
      return {
        title: remoteVersion
          ? `${name} (${remoteVersion} → ${workingVersion})`
          : `${name} (→ ${workingVersion})`,
        value: name,
        disabled: cannotPublish,
      };
    }),
  }).then((answer: Answers<'publishOptions'>) => {
    const filter: Set<string> = new Set(answer.publishOptions);
    return publishOptions.filter((publishOption: ModulePublishOption) => filter.has(publishOption.name));
  });
}