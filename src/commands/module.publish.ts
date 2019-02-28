import { Config, ModulePublishOption } from '../types';
import getCurrentTime from '../utils/getCurrentTime';
import createPublishOptions from '../utils/module/createPublishOptions';
import filterPublishOptions from '../utils/module/filterPublishOptions';
import publish from '../utils/module/publish';

export = function (config: Config) {
  const {appDirectory, modules} = config;
  
  createPublishOptions({
    appDirectory,
    modules: modules.entry,
    version: 'latest',
  })
    .then((publishOptions: ModulePublishOption[]) => {
      return filterPublishOptions(publishOptions);
    })
    .then((publishOptions: ModulePublishOption[]) => {
      return publish({
        publishOptions,
        appDirectory,
      });
    })
    .then(() => {
      console.log(`[${getCurrentTime()}] 👍 Module publish is successful.`);
    })
    .catch((error: Error) => {
      console.error(`[${getCurrentTime()}] 💀 Module publish is failed.`);
      console.error(error);
    });
}