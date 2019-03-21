import path from 'path';
import { Configuration } from 'webpack';
import { Config, ModuleBuildOption } from '../types';
import getCurrentTime from '../utils/getCurrentTime';
import buildTypescriptDeclarations from '../utils/module/buildTypescriptDeclarations';
import copyStaticFiles from '../utils/module/copyStaticFiles';
import createBuildOptions from '../utils/module/createBuildOptions';
import removeDirectory from '../utils/removeDirectory';
import createWebpackConfig from '../utils/webpack/createWebpackConfig';
import runWebpack from '../utils/webpack/run';
import base from '../webpack/base';
import build from '../webpack/build-module';

export = function (config: Config) {
  const {appDirectory, modules, zeroconfigDirectory} = config;
  const outputPath: string = path.join(appDirectory, 'dist/modules');
  const extractCss: boolean = true;
  
  removeDirectory(outputPath)
    .then(() => {
      return createBuildOptions({
        appDirectory: appDirectory,
        modules: modules.entry,
      });
    })
    .then((buildOptions: ModuleBuildOption[]) => new Promise((resolve: () => void, reject: (error: Error) => void) => {
      let i: number = -1;
      
      function func() {
        if (++i < buildOptions.length) {
          const buildOption: ModuleBuildOption = buildOptions[i];
          
          Promise.all([
            buildTypescriptDeclarations({
              appDirectory,
              zeroconfigDirectory,
              buildOption,
            }),
            copyStaticFiles({
              appDirectory,
              buildOption,
            }),
            createWebpackConfig(config, [
              base({
                mode: 'production',
              }),
              build({extractCss, buildOption}),
            ]).then((webpackConfig: Configuration) => {
              return runWebpack(config, webpackConfig);
            }),
          ]).then(() => func())
            .catch((error: Error) => reject(error));
        } else {
          resolve();
        }
      }
      
      func();
    }))
    .then(() => {
      console.log(`[${getCurrentTime()}] 👍 Module build is successful.`);
    })
    .catch((error: Error) => {
      console.error(`[${getCurrentTime()}] 💀 Module build is failed.`);
      console.error(error);
    });
}