import fs from 'fs-extra';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import path from 'path';
import safePostCssParser from 'postcss-safe-parser';
import TerserPlugin from 'terser-webpack-plugin';
import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import { runWebpack } from '../runners/runWebpack';
import { ExtensionConfig } from '../types';
import { sayTitle } from '../utils/sayTitle';
import { createWebpackBaseConfig } from '../webpackConfigs/createWebpackBaseConfig';
import { createWebpackEnvConfig } from '../webpackConfigs/createWebpackEnvConfig';
import { createWebpackWebappConfig } from '../webpackConfigs/createWebpackWebappConfig';

export async function buildExtension({
  cwd,
  app,
  zeroconfigPath,
  staticFileDirectories,
  output,
  extend,
  entryFiles,
  vendorFileName,
  styleFileName,
}: ExtensionConfig) {
  const webpackConfig: Configuration = webpackMerge(
    createWebpackBaseConfig({ zeroconfigPath }),
    {
      mode: 'production',

      output: {
        path: path.join(output, 'extension'),
        filename: `[name].js`,
        chunkFilename: `[name].js`,
      },

      entry: entryFiles.reduce((entry, entryFile) => {
        const extname: string = path.extname(entryFile);
        const filename: string = path.basename(entryFile, extname);

        entry[filename] = path.join(cwd, 'src', app, filename);

        return entry;
      }, {}),

      optimization: {
        concatenateModules: true,
        minimize: true,
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
              map: {
                inline: false,
                annotation: true,
              },
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
        // create html files
        ...(extend.templateFiles.length > 0
          ? extend.templateFiles.map((templateFile) => {
              const extname: string = path.extname(templateFile);
              const filename: string = path.basename(templateFile, extname);

              return new HtmlWebpackPlugin({
                template: path.join(cwd, 'src', app, templateFile),
                filename: filename + '.html',
                chunks: [filename],
              });
            })
          : []),
      ],
    },
    createWebpackWebappConfig({
      extractCss: true,
      cwd,
      chunkPath: '',
      publicPath: '',
      internalEslint: true,
      asyncTypeCheck: false,
    }),
    createWebpackEnvConfig({
      serverPort: 0,
      publicPath: '',
    }),
  );

  try {
    sayTitle('COPY FILES');

    const copyTo: string = path.join(output, 'extension');
    await fs.mkdirp(copyTo);
    await Promise.all(staticFileDirectories.map((dir) => fs.copy(dir, copyTo, { dereference: false })));

    // run webpack
    console.log(await runWebpack(webpackConfig));
  } catch (error) {
    sayTitle('⚠️ COPY FILES ERROR');
    console.error(error);
  }
}
