import LoadablePlugin from '@loadable/webpack-plugin';
import fs from 'fs-extra';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import path from 'path';
import safePostCssParser from 'postcss-safe-parser';
import TerserPlugin from 'terser-webpack-plugin';
import { Configuration } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import webpackMerge from 'webpack-merge';
import { runWebpack } from '../runners/runWebpack';
import { WebappConfig } from '../types';
import { sayTitle } from '../utils/sayTitle';
import { createWebpackBaseConfig } from '../webpackConfigs/createWebpackBaseConfig';
import { createWebpackEnvConfig } from '../webpackConfigs/createWebpackEnvConfig';
import { createWebpackWebappConfig } from '../webpackConfigs/createWebpackWebappConfig';

export async function buildBrowser({
  mode,
  sourceMap,
  output,
  app,
  cwd,
  serverPort,
  staticFileDirectories,
  chunkPath,
  publicPath,
  internalEslint,
  appFileName,
  vendorFileName,
  styleFileName,
  sizeReport,
  extend,
  zeroconfigPath,
}: WebappConfig) {
  const webpackConfig: Configuration = webpackMerge(
    createWebpackBaseConfig({ zeroconfigPath }),
    {
      mode,
      //devtool: mode === 'production' ? false : 'source-map',
      devtool:
        typeof sourceMap === 'boolean'
          ? sourceMap
            ? 'source-map'
            : false
          : mode === 'production'
          ? false
          : 'source-map',

      entry: {
        [appFileName]: path.join(cwd, 'src', app),
      },

      output: {
        path: path.join(output, 'browser'),
        filename: `${chunkPath}[name].[hash].js`,
        chunkFilename: `${chunkPath}[name].[hash].js`,
        publicPath,
      },

      optimization: {
        concatenateModules: mode === 'production',
        minimize: mode === 'production',
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              ecma: 5,
              parse: {
                ecma: 8,
              },
              compress: {
                //ecma: 5,
                warnings: false,
                comparisons: false,
                inline: 2,
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                ascii_only: true,
              },
            },
            parallel: true,
            cache: true,
            sourceMap: true,
          }),
          new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
              parser: safePostCssParser,
              map:
                mode === 'production'
                  ? {
                      inline: false,
                      annotation: true,
                    }
                  : false,
            },
          }),
        ],

        splitChunks: {
          cacheGroups: {
            // vendor chunk
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: vendorFileName,
              chunks: 'all',
            },

            // extract single css file
            style: {
              test: (m) => m.constructor.name === 'CssModule',
              name: styleFileName,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      },

      plugins: [
        // create css files
        new MiniCssExtractPlugin({
          filename: `${chunkPath}[name].[hash].css`,
          chunkFilename: `${chunkPath}[name].[hash].css`,
        }),

        // create size report
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: path.join(output, 'size-report.html'),
          openAnalyzer: sizeReport,
        }),

        // create loadable-stats.json when server side rendering is enabled
        ...(extend.serverSideRendering
          ? [
              new LoadablePlugin({
                filename: '../loadable-stats.json',
                writeToDisk: true,
              }),
            ]
          : []),

        // create html files
        ...(extend.templateFiles.length > 0
          ? extend.templateFiles.map((templateFile) => {
              const extname: string = path.extname(templateFile);
              const filename: string = path.basename(templateFile, extname);

              return new HtmlWebpackPlugin({
                template: path.join(cwd, 'src', app, templateFile),
                filename: filename + '.html',
              });
            })
          : []),
      ],
    },
    createWebpackWebappConfig({
      extractCss: true,
      cwd,
      chunkPath,
      publicPath,
      internalEslint,
    }),
    createWebpackEnvConfig({
      serverPort,
      publicPath,
    }),
  );

  try {
    sayTitle('BUILD BROWSER');

    // create output directory if not exists for loadable-stats.json
    if (extend.serverSideRendering) await fs.mkdirp(path.join(output));

    // copy static file directories
    const copyTo: string = path.join(output, 'browser');
    await fs.mkdirp(copyTo);
    await Promise.all(staticFileDirectories.map((dir) => fs.copy(dir, copyTo, { dereference: true })));

    // run webpack
    console.log(await runWebpack(webpackConfig));
  } catch (error) {
    sayTitle('⚠️ BUILD BROWSER ERROR');
    console.error(error);
  }
}
