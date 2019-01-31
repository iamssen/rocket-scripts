import { Options } from 'browser-sync';
import { Configuration } from 'webpack';
import createBrowserSyncConfig from '../createBrowserSyncConfig';
import createWebpackConfig from '../createWebpackConfig';
import getCurrentTime from '../getCurrentTime';
import runBrowserSync from '../runBrowserSync';
import { Config } from '../types';
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