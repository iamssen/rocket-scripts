import { Options } from 'browser-sync';
import { Configuration } from 'webpack';
import { Config } from '../types';
import getCurrentTime from '../utils/getCurrentTime';
import createBrowserSyncConfig from '../utils/web/createBrowserSyncConfig';
import runBrowserSync from '../utils/web/runBrowserSync';
import createWebpackConfig from '../utils/webpack/createWebpackConfig';
import app from '../webpack/app';
import base from '../webpack/base';
import client from '../webpack/client';
import start from '../webpack/start-web';

export = function (config: Config) {
  const extractCss: boolean = false;
  
  createWebpackConfig(config, [
    base({
      mode: 'development',
      devtool: 'cheap-module-eval-source-map',
      output: {
        path: config.appDirectory,
      },
    }),
    app({extractCss}),
    client(),
    start(),
  ]).then((webpackConfig: Configuration) => {
      return createBrowserSyncConfig(config, webpackConfig);
    })
    .then((browserSyncConfig: Options) => {
      runBrowserSync(browserSyncConfig).subscribe(
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