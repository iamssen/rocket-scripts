import path from 'path';
import { Configuration } from 'webpack';
import { Config } from '../types';
import getCurrentTime from '../utils/getCurrentTime';
import removeDirectory from '../utils/removeDirectory';
import copyPackageJsonToSSR from '../utils/web/copyPackageJsonToSSR';
import createWebpackConfig from '../utils/webpack/createWebpackConfig';
import watchWebpack from '../utils/webpack/watch';
import app from '../webpack/app';
import base from '../webpack/base';
import build from '../webpack/build-ssr';
import ssr from '../webpack/ssr';

export = function (config: Config) {
  const outputPath: string = path.join(config.appDirectory, 'dist-dev/ssr');
  const extractCss: boolean = true;
  const isProduction: boolean = false;
  
  removeDirectory(outputPath)
    .then(() => {
      return createWebpackConfig(config, [
        base({
          mode: 'development',
          output: {
            path: outputPath,
          },
        }),
        app({extractCss}),
        ssr(),
        build({isProduction}),
      ]);
    })
    .then((webpackConfig: Configuration) => {
      watchWebpack(config, webpackConfig).subscribe(
        () => {
          copyPackageJsonToSSR({
            appDirectory: config.appDirectory,
            outputPath: path.join(outputPath, 'package.json'),
          }).then(() => {
            console.log(`[${getCurrentTime()}] 👍 App build is successful.`);
          }).catch((error: Error) => {
            console.error(`[${getCurrentTime()}] 💀 App build is failed.`);
            console.error(error);
          });
        },
        (error: Error) => {
          console.error(`[${getCurrentTime()}] 💀 App build is failed.`);
          console.error(error);
        },
      );
    })
    .catch((error: Error) => {
      console.error(`[${getCurrentTime()}] 💀 App build is failed.`);
      console.error(error);
    });
};