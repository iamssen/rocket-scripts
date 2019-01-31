import getCurrentTime from '../getCurrentTime';
import { Config, ModulePublishOption } from '../types';
import createModulePublishOptions = require('../createModulePublishOptions');
import filterModulePublishOptions = require('../filterModulePublishOptions');
import publishModules = require('../publishModules');

export = function (config: Config) {
  const {appDirectory, modules} = config;
  
  createModulePublishOptions({
    appDirectory,
    modules: modules.entry,
    version: 'latest',
  })
    .then((publishOptions: ModulePublishOption[]) => {
      return filterModulePublishOptions(publishOptions);
    })
    .then((publishOptions: ModulePublishOption[]) => {
      return publishModules({
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