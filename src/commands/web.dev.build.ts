import path from 'path';
import { Configuration } from 'webpack';
import copyStaticFileDirectories from '../copyStaticFileDirectories';
import createWebpackConfig from '../createWebpackConfig';
import getCurrentTime from '../getCurrentTime';
import removeDirectory from '../removeDirectory';
import runWebpack from '../runWebpack';
import { Config } from '../types';
import app from '../webpack/app';
import base from '../webpack/base';
import build from '../webpack/build-web';
import client from '../webpack/client';

export = function (config: Config) {
  const outputPath: string = path.join(config.appDirectory, 'dist-dev/web');
  const extractCss: boolean = true;
  const isProduction: boolean = false;
  
  removeDirectory(outputPath)
    .then(() => {
      return copyStaticFileDirectories({
        staticFileDirectories: config.app.staticFileDirectories,
        outputPath,
      });
    })
    .then(() => {
      return createWebpackConfig(config, [
        base({
          mode: 'development',
          devtool: 'source-map',
          output: {
            path: outputPath,
          },
        }),
        app({extractCss}),
        client(),
        build({isProduction}),
      ]);
    })
    .then((webpackConfig: Configuration) => {
      return runWebpack(config, webpackConfig);
    })
    .then(() => {
      console.log(`[${getCurrentTime()}] 👍 App build is successful.`);
    })
    .catch((error: Error) => {
      console.error(`[${getCurrentTime()}] 💀 App build is failed.`);
      console.error(error);
    });
};