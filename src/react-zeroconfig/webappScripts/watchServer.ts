import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import { watchWebpack } from '../runners/watchWebpack';
import { watingFiles } from '../runners/watingFiles';
import { WebappConfig } from '../types';
import { sayTitle } from '../utils/sayTitle';
import { createWebpackBaseConfig } from '../webpackConfigs/createWebpackBaseConfig';
import { createWebpackWebappConfig } from '../webpackConfigs/createWebpackWebappConfig';
import { createWebpackEnvConfig } from '../webpackConfigs/createWebpackEnvConfig';

export async function watchServer({
  app,
  cwd,
  serverPort,
  publicPath,
  internalEslint,
  output,
  chunkPath,
  zeroconfigPath,
}: WebappConfig) {
  const loadableStatsJson: string = path.join(output, 'loadable-stats.json');

  sayTitle('WATING FILES');
  await watingFiles([loadableStatsJson]);

  const webpackConfig: Configuration = webpackMerge(
    createWebpackBaseConfig({ zeroconfigPath }),
    {
      target: 'node',
      mode: 'development',
      devtool: 'source-map',

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

      externals: [
        nodeExternals({
          // include asset files
          whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
        }),
      ],

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
      internalEslint,
      asyncTypeCheck: false,
    }),
    createWebpackEnvConfig({
      serverPort,
      publicPath,
    }),
  );

  // watch webpack
  watchWebpack(webpackConfig).subscribe({
    next: (webpackMessage) => {
      sayTitle('WATCH SERVER');
      console.log(webpackMessage);
    },
    error: (error) => {
      sayTitle('⚠️ WATCH SERVER ERROR');
      console.error(error);
    },
  });
}
