import copyStaticFileDirectories from '../copyStaticFileDirectories';
import createWebpackConfig from '../createWebpackConfig';
import getCurrentTime from '../getCurrentTime';
import removeDirectory from '../removeDirectory';
import { Config } from '../types';
import watchWebpack from '../watchWebpack';
import app from '../webpack/app';
import base from '../webpack/base';
import build from '../webpack/build-web';
import client from '../webpack/client';
import style from '../webpack/style';

export = function (config: Config) {
  const outputPath: string = `${config.appDirectory}/dist-dev/web`;
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
        app(),
        client(),
        style({extractCss}),
        build({isProduction}),
      ]);
    })
    .then(webpackConfig => {
      watchWebpack(config, webpackConfig).subscribe(
        () => {
          console.log(`[${getCurrentTime()}] 👍 App build is successful.`);
        },
        error => {
          console.error(`[${getCurrentTime()}] 💀 App build is failed.`);
          console.error(error);
        },
      );
    })
    .catch(error => {
      console.error(`[${getCurrentTime()}] 💀 App build is failed.`);
      console.error(error);
    });
};