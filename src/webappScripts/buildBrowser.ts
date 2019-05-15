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
import { createBaseWebpackConfig } from '../webpackConfigs/createBaseWebpackConfig';
import { createWebappWebpackConfig } from '../webpackConfigs/createWebappWebpackConfig';

// work
// - [x] create js, css files by webpack
// - [x] copy static files
// - [x] create size-report.html
// - [x] create loadable-stats.json when server side rendering is enabled
// - [x] create html files when templates are exists
// staticFileDirectories
// - [x] should be copied all static file directories to output/browser
// sizeReport
// - [x] should be open size report when sizeReport is true
// mode
// - [x] mode, devtool, concatenateModules, minimize, css optimize
// output
// - [x] output/browser
// - [x] size-report.html
// - [x] loadable-stats.json
// - [x] copy static files to output/browser
// - [x] mkdirp before create loadable-stats.json
// appFileName
// - [x] entry name
// vendorFileName
// - [x] using on chunks2-webpack-plugin
// - [x] pass to createBrowserAppWebpackConfig
// styleFileName
// - [x] using on chunks2-webpack-plugin
// - [x] pass to createBrowserAppWebpackConfig
// chunkPath
// - [x] css name
// - [x] pass to createBrowserAppWebpackConfig
// publicPath
// - [x] webpack public path
// - [x] process.env.PUBLIC_PATH
// port
// - none of effect to this task
// serverPort
// - [x] process.env.SERVER_PORT
// https
// - none of effect to this task
// extend.serverSideRendering
// - [x] create output directory for create loadable-stats.json
// - [x] create loadable-stats.json
// extend.templateFiles
// - [x] create html files
export async function buildBrowser({
                                     mode,
                                     output,
                                     app,
                                     cwd,
                                     serverPort,
                                     staticFileDirectories,
                                     chunkPath,
                                     publicPath,
                                     appFileName,
                                     vendorFileName,
                                     styleFileName,
                                     sizeReport,
                                     extend,
                                     zeroconfigPath,
                                   }: WebappConfig) {
  const webpackConfig: Configuration = webpackMerge(
    createBaseWebpackConfig({zeroconfigPath}),
    {
      mode,
      devtool: mode === 'production' ? false : 'source-map',
      
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
              map: mode === 'production'
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
              test: m => m.constructor.name === 'CssModule',
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
        ...(extend.serverSideRendering ? [
          new LoadablePlugin({
            filename: '../loadable-stats.json',
            writeToDisk: true,
          }),
        ] : []),
        
        // create html files
        ...(extend.templateFiles.length > 0 ? extend.templateFiles.map(templateFile => {
          const extname: string = path.extname(templateFile);
          const filename: string = path.basename(templateFile, extname);
          
          return new HtmlWebpackPlugin({
            template: path.join(cwd, 'src', app, templateFile),
            filename: filename + '.html',
          });
        }) : []),
      ],
    },
    createWebappWebpackConfig({
      extractCss: true,
      cwd,
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
    await Promise.all(staticFileDirectories.map(dir => fs.copy(dir, copyTo, {dereference: true})));
    
    // run webpack
    console.log(await runWebpack(webpackConfig));
  } catch (error) {
    sayTitle('⚠️ BUILD BROWSER ERROR');
    console.error(error);
  }
}