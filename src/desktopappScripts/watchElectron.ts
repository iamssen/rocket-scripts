import fs from 'fs-extra';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Observable } from 'rxjs';
import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import { mirrorFiles, MirrorResult } from '../runners/mirrorFiles';
import { watchWebpack } from '../runners/watchWebpack';
import { DesktopappConfig } from '../types';
import { sayTitle } from '../utils/sayTitle';
import { createWebpackBaseConfig } from '../webpackConfigs/createWebpackBaseConfig';
import { createWebpackEnvConfig } from '../webpackConfigs/createWebpackEnvConfig';
import { createWebpackWebappConfig } from '../webpackConfigs/createWebpackWebappConfig';
import { validateAppDependencies } from './validateAppDependencies';

export async function watchElectron({
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
  
  const webpackMainConfig: Configuration = webpackMerge(
    createWebpackBaseConfig({zeroconfigPath}),
    {
      target: 'electron-main',
      mode: 'development',
      devtool: 'source-map',
      
      resolve: {
        mainFields: ['main'],
      },
      
      externals: [nodeExternals({
        whitelist: [
          // include asset files
          /\.(?!(?:jsx?|json)$).{1,5}$/i,
        ],
      })],
      
      entry: {
        main: path.join(cwd, 'src', app, 'main'),
      },
      
      output: {
        path: path.join(output, 'electron'),
      },
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
      mode: 'development',
      devtool: 'source-map',
      
      resolve: {
        mainFields: ['main'],
      },
      
      externals: [nodeExternals({
        whitelist: [
          // include asset files
          /\.(?!(?:jsx?|json)$).{1,5}$/i,
        ],
      })],
      
      entry: {
        renderer: path.join(cwd, 'src', app, 'renderer'),
      },
      
      output: {
        path: path.join(output, 'electron'),
      },
      
      plugins: [
        // create css files
        new MiniCssExtractPlugin({
          filename: `[name].css`,
        }),
        
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
    sayTitle('MIRROR FILES START');
    
    const watcher: Observable<MirrorResult> = await mirrorFiles({
      sources: staticFileDirectories,
      output: path.join(output, 'electron'),
    });
    
    // mirror files
    watcher.subscribe({
      next: ({file, treat}) => {
        sayTitle('MIRROR FILE');
        console.log(`[${treat}] ${file}`);
      },
      error: error => {
        sayTitle('⚠️ MIRROR FILE ERROR');
        console.error(error);
      },
    });
    
    // watch webpack
    watchWebpack(webpackMainConfig).subscribe({
      next: webpackMessage => {
        sayTitle('WATCH ELECTRON MAIN');
        console.log(webpackMessage);
      },
      error: error => {
        sayTitle('⚠️ WATCH ELECTRON MAIN ERROR');
        console.error(error);
      },
    });
    
    // watch webpack
    watchWebpack(webpackRendererConfig).subscribe({
      next: webpackMessage => {
        sayTitle('WATCH ELECTRON RENDERER');
        console.log(webpackMessage);
      },
      error: error => {
        sayTitle('⚠️ WATCH ELECTRON RENDERER ERROR');
        console.error(error);
      },
    });
  } catch (error) {
    sayTitle('⚠️ COPY FILES ERROR');
    console.error(error);
  }
}