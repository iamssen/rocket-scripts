import path from 'path';
import { Configuration } from 'webpack';
import { Config } from '../types';
import getCurrentTime from '../utils/getCurrentTime';
import removeDirectory from '../utils/removeDirectory';
import copyStaticFileDirectories from '../utils/web/copyStaticFileDirectories';
import createWebpackConfig from '../utils/webpack/createWebpackConfig';
import watchWebpack from '../utils/webpack/watch';
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
      watchWebpack(config, webpackConfig).subscribe(
        () => {
          console.log(`[${getCurrentTime()}] 👍 App build is successful.`);
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