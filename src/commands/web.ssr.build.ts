import path from 'path';
import createWebpackConfig from '../createWebpackConfig';
import getCurrentTime from '../getCurrentTime';
import removeDirectory from '../removeDirectory';
import runWebpack from '../runWebpack';
import { Config } from '../types';
import app from '../webpack/app';
import base from '../webpack/base';
import build from '../webpack/build-ssr';
import ssr from '../webpack/ssr';
import style from '../webpack/style';

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
        app(),
        ssr(),
        style({extractCss}),
        build({isProduction}),
      ]);
    })
    .then(webpackConfig => {
      return runWebpack(config, webpackConfig);
    })
    .then(() => {
      console.log(`[${getCurrentTime()}] 👍 App build is successful.`);
    })
    .catch(error => {
      console.error(`[${getCurrentTime()}] 💀 App build is failed.`);
      console.error(error);
    });
};