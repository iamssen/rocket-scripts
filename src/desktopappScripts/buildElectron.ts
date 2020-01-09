import chalk from 'chalk';
import fs from 'fs-extra';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import path from 'path';
import safePostCssParser from 'postcss-safe-parser';
import TerserPlugin from 'terser-webpack-plugin';
import { Configuration, Options } from 'webpack';
import webpackMerge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import { copyElectronPackageJson } from '../runners/copyElectronPackageJson';
import { runWebpack } from '../runners/runWebpack';
import { DesktopappConfig } from '../types';
import { sayTitle } from '../utils/sayTitle';
import { createWebpackBaseConfig } from '../webpackConfigs/createWebpackBaseConfig';
import { createWebpackEnvConfig } from '../webpackConfigs/createWebpackEnvConfig';
import { createWebpackWebappConfig } from '../webpackConfigs/createWebpackWebappConfig';
import { externalWhiteList } from './externalWhiteList';

export async function buildElectron({
                                      cwd,
                                      app,
                                      zeroconfigPath,
                                      staticFileDirectories,
                                      output,
                                      extend,
                                    }: DesktopappConfig) {
  const optimization: Options.Optimization = {
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
  };
  
  const webpackMainConfig: Configuration = webpackMerge(
    createWebpackBaseConfig({zeroconfigPath}),
    {
      target: 'electron-main',
      mode: 'production',
      
      resolve: {
        mainFields: ['main'],
      },
      
      externals: [nodeExternals({
        whitelist: [
          // include asset files
          /\.(?!(?:jsx?|json)$).{1,5}$/i,
          ...externalWhiteList({cwd, app}),
        ],
      })],
      
      entry: {
        main: path.join(cwd, 'src', app, 'main'),
      },
      
      output: {
        path: path.join(output, 'electron'),
      },
      
      optimization,
    },
    createWebpackWebappConfig({
      extractCss: true,
      cwd,
      chunkPath: '',
      publicPath: '',
      internalEslint: true,
    }),
    createWebpackEnvConfig({
      serverPort: 0,
      publicPath: '',
    }),
  );
  
  const webpackRendererConfig: Configuration = webpackMerge(
    createWebpackBaseConfig({zeroconfigPath}),
    {
      target: 'electron-renderer',
      mode: 'production',
      
      resolve: {
        mainFields: ['main'],
      },
      
      externals: [nodeExternals({
        whitelist: [
          // include asset files
          /\.(?!(?:jsx?|json)$).{1,5}$/i,
          ...externalWhiteList({cwd, app}),
        ],
      })],
      
      entry: {
        renderer: path.join(cwd, 'src', app, 'renderer'),
      },
      
      output: {
        path: path.join(output, 'electron'),
      },
      
      optimization,
      
      plugins: [
        // create css files
        new MiniCssExtractPlugin({
          filename: `[name].css`,
        }),
        
        // TODO bundle analyzer plugin
        
        // create html files
        ...(extend.templateFiles.length > 0 ? extend.templateFiles.map(templateFile => {
          const extname: string = path.extname(templateFile);
          const filename: string = path.basename(templateFile, extname);
          
          return new HtmlWebpackPlugin({
            template: path.join(cwd, 'src', app, templateFile),
            filename: filename + '.html',
            chunks: ['renderer'],
          });
        }) : []),
      ],
    },
    createWebpackWebappConfig({
      extractCss: true,
      cwd,
      chunkPath: '',
      publicPath: '',
      internalEslint: true,
    }),
    createWebpackEnvConfig({
      serverPort: 0,
      publicPath: '',
    }),
  );
  
  try {
    sayTitle('COPY FILES');
    
    const copyTo: string = path.join(output, 'electron');
    await fs.mkdirp(copyTo);
    await Promise.all(staticFileDirectories.map(dir => fs.copy(dir, copyTo, {dereference: false})));
    
    sayTitle('BUILD ELECTRON MAIN');
    console.log(await runWebpack(webpackMainConfig));
    
    sayTitle('BUILD ELECTRON RENDERER');
    console.log(await runWebpack(webpackRendererConfig));
    
    if (!fs.pathExistsSync(path.join(output, 'electron/node_modules'))) {
      const dir: string = path.join(output, 'electron');
      await fs.mkdirp(dir);
      await fs.symlink(path.join(cwd, 'node_modules'), path.join(output, 'electron/node_modules'));
    }
    
    sayTitle('BUILD ELECTRON');
    
    await copyElectronPackageJson({
      file: path.join(cwd, 'package.json'),
      app: path.join(cwd, 'src', app, 'package.json'),
      copyTo: path.join(output, 'electron/package.json'),
    });
    
    console.log('BUILD ELECTRON COMPLETED');
    console.log(`Please execute this command below for pack this application:`);
    console.log(chalk.bold.yellow(`electron-builder --project ${path.join(output, 'electron')}`));
  } catch (error) {
    sayTitle('⚠️ BUILD ELECTRON ERROR');
    console.error(error);
  }
}