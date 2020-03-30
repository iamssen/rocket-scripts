import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { Observable } from 'rxjs';
import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import { mirrorFiles, MirrorResult } from '../runners/mirrorFiles';
import { watchWebpack } from '../runners/watchWebpack';
import { ExtensionConfig } from '../types';
import { sayTitle } from '../utils/sayTitle';
import { createWebpackBaseConfig } from '../webpackConfigs/createWebpackBaseConfig';
import { createWebpackEnvConfig } from '../webpackConfigs/createWebpackEnvConfig';
import { createWebpackWebappConfig } from '../webpackConfigs/createWebpackWebappConfig';

export async function watchExtension({
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
      mode: 'development',
      devtool: 'source-map',

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
        moduleIds: 'named',
        //namedModules: true,
        noEmitOnErrors: true,

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
    sayTitle('MIRROR FILES START');

    const watcher: Observable<MirrorResult> = await mirrorFiles({
      sources: staticFileDirectories,
      output: path.join(output, 'extension'),
    });

    // mirror files
    watcher.subscribe({
      next: ({ file, treat }) => {
        sayTitle('MIRROR FILE');
        console.log(`[${treat}] ${file}`);
      },
      error: (error) => {
        sayTitle('⚠️ MIRROR FILE ERROR');
        console.error(error);
      },
    });

    // watch webpack
    watchWebpack(webpackConfig).subscribe({
      next: (webpackMessage) => {
        sayTitle('WATCH EXTENSION');
        console.log(webpackMessage);
      },
      error: (error) => {
        sayTitle('⚠️ WATCH EXTENSION ERROR');
        console.error(error);
      },
    });
  } catch (error) {
    sayTitle('⚠️ COPY FILES ERROR');
    console.error(error);
  }
}
