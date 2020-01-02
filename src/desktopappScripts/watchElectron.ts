import fs from 'fs-extra';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import { watchWebpack } from '../runners/watchWebpack';
import { DesktopappConfig } from '../types';
import { sayTitle } from '../utils/sayTitle';
import { createWebpackBaseConfig } from '../webpackConfigs/createWebpackBaseConfig';
import { createWebpackEnvConfig } from '../webpackConfigs/createWebpackEnvConfig';
import { createWebpackWebappConfig } from '../webpackConfigs/createWebpackWebappConfig';

export async function watchElectron({
                                      cwd,
                                      app,
                                      zeroconfigPath,
                                      staticFileDirectories,
                                      output,
                                      extend,
                                    }: DesktopappConfig) {
  const webpackConfig: Configuration = webpackMerge(
    createWebpackBaseConfig({zeroconfigPath}),
    {
      target: 'electron-main',
      mode: 'development',
      devtool: 'source-map',
      
      entry: {
        index: path.join(cwd, 'src', app, 'index'),
        main: path.join(cwd, 'src', app, 'main'),
      },
      
      output: {
        path: path.join(output, 'electron'),
        libraryTarget: 'commonjs2',
      },
      
      externals: [nodeExternals({
        // include asset files
        whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
      })],
      
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
            chunks: ['index'],
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
    
    // TODO watch mode
    const copyTo: string = path.join(output, 'electron');
    await fs.mkdirp(copyTo);
    await Promise.all(staticFileDirectories.map(dir => fs.copy(dir, copyTo, {dereference: true})));
    
    // watch webpack
    watchWebpack(webpackConfig).subscribe({
      next: webpackMessage => {
        sayTitle('WATCH ELECTRON');
        console.log(webpackMessage);
      },
      error: error => {
        sayTitle('⚠️ WATCH ELECTRON ERROR');
        console.error(error);
      },
    });
  } catch (error) {
    sayTitle('⚠️ COPY FILES ERROR');
    console.error(error);
  }
}