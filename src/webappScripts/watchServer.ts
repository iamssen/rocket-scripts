import path from 'path';
import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import { watchWebpack } from '../runners/watchWebpack';
import { watingFiles } from '../runners/watingFiles';
import { WebappConfig } from '../types';
import { sayTitle } from '../utils/sayTitle';
import { createBaseWebpackConfig } from '../webpackConfigs/createBaseWebpackConfig';
import { createServerAppWebpackConfig } from '../webpackConfigs/createServerAppWebapckConfig';
import { createWebappWebpackConfig } from '../webpackConfigs/createWebappWebpackConfig';

// work
// - [x] wating files for create loadable-stats.json
// - [x] loadable-stats.json to alias to pass to server side rendering
// staticFileDirectories
// - none of effect to this task
// sizeReport
// - none of effect to this task
// mode
// - none of effect to this task
// output
// - [x] output/server
// appFileName
// - none of effect to this task
// vendorFileName
// - none of effect to this task
// styleFileName
// - none of effect to this task
// chunkPath
// - none of effect to this task
// publicPath
// - [x] process.env.PUBLIC_PATH
// port
// - none of effect to this task
// serverPort
// - [x] process.env.SERVER_PORT
// https
// - none of effect to this task
// extend.serverSideRendering
// - none of effect to this task
// extend.templateFiles
// - none of effect to this task
export async function watchServer({
                                    app,
                                    cwd,
                                    serverPort,
                                    publicPath,
                                    output,
                                    zeroconfigPath,
                                  }: WebappConfig) {
  const loadableStatsJson: string = path.join(output, 'loadable-stats.json');
  
  sayTitle('WATING FILES');
  await watingFiles([loadableStatsJson]);
  
  const webpackConfig: Configuration = webpackMerge(
    createBaseWebpackConfig({zeroconfigPath}),
    {
      target: 'node',
      mode: 'development',
      devtool: 'source-map',
      output: {
        path: path.join(output, 'server'),
      },
      resolve: {
        alias: {
          'loadable-stats.json': loadableStatsJson,
        },
      },
    },
    createWebappWebpackConfig({
      extractCss: true,
      cwd,
      serverPort,
      publicPath,
    }),
    createServerAppWebpackConfig({
      cwd,
      app,
    }),
  );
  
  // watch webpack
  watchWebpack(webpackConfig).subscribe({
    next: webpackMessage => {
      sayTitle('WATCH SERVER');
      console.log(webpackMessage);
    },
    error: error => {
      sayTitle('⚠️ WATCH SERVER ERROR');
      console.error(error);
    },
  });
}