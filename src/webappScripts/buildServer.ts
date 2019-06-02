import fs from 'fs-extra';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import { copyServerPackageJson } from '../runners/copyServerPackageJson';
import { runWebpack } from '../runners/runWebpack';
import { WebappConfig } from '../types';
import { sayTitle } from '../utils/sayTitle';
import { createWebpackBaseConfig } from '../webpackConfigs/createWebpackBaseConfig';
import { createWebpackWebappConfig } from '../webpackConfigs/createWebpackWebappConfig';
import { createWebpackEnvConfig } from '../webpackConfigs/createWebpackEnvConfig';

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
                                    chunkPath,
                                  }: WebappConfig) {
  const loadableStatsJson: string = path.join(output, 'loadable-stats.json');
  
  if (![loadableStatsJson].every(fs.pathExistsSync)) {
    throw new Error(`Required file ${loadableStatsJson}`);
  }
  
  const webpackConfig: Configuration = webpackMerge(
    createWebpackBaseConfig({zeroconfigPath}),
    {
      target: 'node',
      mode,
      devtool: mode === 'production' ? false : 'source-map',
      
      entry: {
        index: path.join(cwd, 'src', app, 'server'),
      },
      
      output: {
        path: path.join(output, 'server'),
        libraryTarget: 'commonjs',
      },
      
      resolve: {
        alias: {
          'loadable-stats.json': loadableStatsJson,
          '@loadable/stats.json': loadableStatsJson,
        },
      },
      
      externals: [nodeExternals({
        // include asset files
        whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
      })],
      
      plugins: [
        new MiniCssExtractPlugin({
          filename: `[name].css`,
        }),
      ],
    },
    createWebpackWebappConfig({
      extractCss: true,
      cwd,
      chunkPath,
      publicPath,
    }),
    createWebpackEnvConfig({
      serverPort,
      publicPath,
    }),
  );
  
  try {
    sayTitle('BUILD SERVER');
    
    // run webpack
    console.log(await runWebpack(webpackConfig));
    
    // copy package.json
    await copyServerPackageJson({
      file: path.join(cwd, 'package.json'),
      copyTo: path.join(output, 'server/package.json'),
    });
  } catch (error) {
    sayTitle('⚠️ BUILD SERVER ERROR');
    console.error(error);
  }
}