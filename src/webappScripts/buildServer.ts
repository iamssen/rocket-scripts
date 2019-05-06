import fs from 'fs-extra';
import path from 'path';
import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import { copyServerPackageJson } from '../runners/copyServerPackageJson';
import { runWebpack } from '../runners/runWebpack';
import { WebappConfig } from '../types';
import { sayTitle } from '../utils/sayTitle';
import { createBaseWebpackConfig } from '../webpackConfigs/createBaseWebpackConfig';
import { createServerAppWebpackConfig } from '../webpackConfigs/createServerAppWebapckConfig';
import { createWebappWebpackConfig } from '../webpackConfigs/createWebappWebpackConfig';

// work
// - [x] works after buildBrowser
// - [x] require exists file loadable-stats.json
// - [x] loadable-stats.json to alias to pass to server side rendering
// - [x] copy package.json to output/server
// staticFileDirectories
// - none of effect to this task
// sizeReport
// - none of effect to this task
// mode
// - [x] mode, devtool
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
export async function buildServer({
                                    app,
                                    mode,
                                    cwd,
                                    output,
                                    publicPath,
                                    serverPort,
                                    zeroconfigPath,
                                  }: WebappConfig) {
  const loadableStatsJson: string = path.join(output, 'loadable-stats.json');
  
  if (![loadableStatsJson].every(fs.pathExistsSync)) {
    throw new Error(`Required file ${loadableStatsJson}`);
  }
  
  const webpackConfig: Configuration = webpackMerge(
    createBaseWebpackConfig({zeroconfigPath}),
    {
      target: 'node',
      mode,
      devtool: mode === 'production' ? false : 'source-map',
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
  
  try {
    sayTitle('BUILD SERVER');
    
    // run webpack
    console.log(await runWebpack(webpackConfig));
    
    // copy package.json
    await copyServerPackageJson({cwd, copyTo: path.join(output, 'server/package.json')});
  } catch (error) {
    sayTitle('⚠️ BUILD SERVER ERROR');
    console.error(error);
  }
}