import path from 'path';
import { Configuration } from 'webpack';
import copyPackageJsonToSSR from '../copyPackageJsonToSSR';
import createWebpackConfig from '../createWebpackConfig';
import getCurrentTime from '../getCurrentTime';
import removeDirectory from '../removeDirectory';
import runWebpack from '../runWebpack';
import { Config } from '../types';
import app from '../webpack/app';
import base from '../webpack/base';
import build from '../webpack/build-ssr';
import ssr from '../webpack/ssr';

export = function (config: Config) {
  const outputPath: string = path.join(config.appDirectory, 'dist/ssr');
  const extractCss: boolean = true;
  const isProduction: boolean = true;
  
  removeDirectory(outputPath)
    .then(() => {
      return createWebpackConfig(config, [
        base({
          mode: 'production',
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
      return runWebpack(config, webpackConfig);
    })
    .then(() => {
      return copyPackageJsonToSSR({
        appDirectory: config.appDirectory,
        outputPath: path.join(outputPath, 'package.json'),
      });
    })
    .then(() => {
      console.log(`[${getCurrentTime()}] 👍 App build is successful.`);
    })
    .catch((error: Error) => {
      console.error(`[${getCurrentTime()}] 💀 App build is failed.`);
      console.error(error);
    });
};