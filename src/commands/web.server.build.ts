import path from 'path';
import { Configuration } from 'webpack';
import { Config } from '../types';
import getCurrentTime from '../utils/getCurrentTime';
import removeDirectory from '../utils/removeDirectory';
import copyPackageJsonToServer from '../utils/web/copyPackageJsonToServer';
import createWebpackConfig from '../utils/webpack/createWebpackConfig';
import runWebpack from '../utils/webpack/run';
import app from '../webpack/app';
import base from '../webpack/base';
import build from '../webpack/build-server';
import server from '../webpack/server';

export = function (config: Config) {
  const outputPath: string = path.join(config.appDirectory, 'dist/server');
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
        server(),
        build({isProduction}),
      ]);
    })
    .then((webpackConfig: Configuration) => {
      return runWebpack(config, webpackConfig);
    })
    .then(() => {
      return copyPackageJsonToServer({
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