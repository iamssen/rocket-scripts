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
import { runWebpack } from '../runners/runWebpack';
import { DesktopappConfig } from '../types';
import { sayTitle } from '../utils/sayTitle';
import { createWebpackBaseConfig } from '../webpackConfigs/createWebpackBaseConfig';
import { createWebpackEnvConfig } from '../webpackConfigs/createWebpackEnvConfig';
import { createWebpackWebappConfig } from '../webpackConfigs/createWebpackWebappConfig';
import { copyElectronPackageJson } from './copyElectronPackageJson';
import { getRendererExternals } from './getRendererExternals';
import { validateAppDependencies } from './validateAppDependencies';

export async function buildElectron({
                                      cwd,
                                      app,
                                      zeroconfigPath,
                                      staticFileDirectories,
                                      output,
                                      extend,
                                    }: DesktopappConfig) {
  try {
    validateAppDependencies({
      projectPackageJson: fs.readJsonSync(path.join(cwd, 'package.json')),
      appPackageJson: fs.readJsonSync(path.join(cwd, 'src', app, 'package.json')),
    });
  } catch (error) {
    sayTitle('⚠️ APP PACKAGE.JSON DEPENDENCIES ERROR');
    console.error(error);
    process.exit(1);
  }
  
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
      
      externals: ['electron', ...getRendererExternals({cwd, app})],
      
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
      
      externals: ['electron', ...getRendererExternals({cwd, app})],
      
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
    
    sayTitle('NPM INSTALL');
    
    await copyElectronPackageJson({
      file: path.join(cwd, 'package.json'),
      app: path.join(cwd, 'src', app, 'package.json'),
      copyTo: path.join(output, 'electron/package.json'),
    });
    
    console.log('BUILD ELECTRON COMPLETED');
    console.log(`Please execute this command below for pack this application:`);
    console.log(chalk.bold.yellow(`cd ${path.relative(cwd, path.join(output, 'electron'))} && npm install && electron-rebuild && electron-builder --mac --win --linux`));
  } catch (error) {
    sayTitle('⚠️ BUILD ELECTRON ERROR');
    console.error(error);
  }
}