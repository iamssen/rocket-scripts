import LoadablePlugin from '@loadable/webpack-plugin';
import browserSync, { MiddlewareHandler, Options } from 'browser-sync';
import compression from 'compression';
import fs from 'fs-extra';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { IncomingMessage, ServerResponse } from 'http';
import proxyMiddleware, { Options as HttpProxyMiddlewareOptions } from 'http-proxy-middleware';
import path from 'path';
import { PackageJson } from 'type-fest';
import webpack, { Compiler, Configuration, HotModuleReplacementPlugin } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackMerge from 'webpack-merge';
import { WebappConfig } from '../types';
import { sayTitle } from '../utils/sayTitle';
import { createWebpackBaseConfig } from '../webpackConfigs/createWebpackBaseConfig';
import { createWebpackEnvConfig } from '../webpackConfigs/createWebpackEnvConfig';
import { createWebpackWebappConfig } from '../webpackConfigs/createWebpackWebappConfig';

export async function startBrowser({
                                     cwd,
                                     app,
                                     output,
                                     port,
                                     https,
                                     serverPort,
                                     staticFileDirectories,
                                     chunkPath,
                                     publicPath,
                                     internalEslint,
                                     appFileName,
                                     vendorFileName,
                                     styleFileName,
                                     extend,
                                     zeroconfigPath,
                                   }: WebappConfig) {
  const webpackConfig: Configuration = webpackMerge(
    createWebpackBaseConfig({zeroconfigPath}),
    {
      mode: 'development',
      devtool: 'cheap-module-eval-source-map',
      output: {
        path: cwd,
        publicPath,
        filename: `${chunkPath}[name].js`,
        chunkFilename: `${chunkPath}[name].js`,
        pathinfo: false,
      },
      resolve: {
        symlinks: false,
      },
      entry: {
        [appFileName]: [
          `${path.dirname(require.resolve('webpack-hot-middleware/package.json'))}/client?http://localhost:${port}`,
          `${path.dirname(require.resolve('webpack/package.json'))}/hot/only-dev-server`,
          path.join(cwd, 'src', app),
        ],
      },
      optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
        
        namedModules: true,
        noEmitOnErrors: true,
        
        //splitChunks: {
        //  cacheGroups: {
        //    // vendor chunk
        //    vendor: {
        //      test: /[\\/]node_modules[\\/]/,
        //      name: vendorFileName,
        //      chunks: 'all',
        //    },
        //
        //    // extract single css file
        //    style: {
        //      test: m => m.constructor.name === 'CssModule',
        //      name: styleFileName,
        //      chunks: 'all',
        //      enforce: true,
        //    },
        //  },
        //},
      },
      
      plugins: [
        new HotModuleReplacementPlugin(),
        
        // create loadable-stats.json when server side rendering enabled
        ...(extend.serverSideRendering ? [
          new LoadablePlugin({
            filename: path.join(output, 'loadable-stats.json'),
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
    createWebpackWebappConfig({
      extractCss: false,
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
  
  const compiler: Compiler.Watching | Compiler = webpack(webpackConfig);
  
  //@ts-ignore as MiddlewareHandler
  const webpackDevMiddlewareHandler: MiddlewareHandler = webpackDevMiddleware(compiler, {
    publicPath: publicPath,
    stats: {colors: true},
  });
  
  const middleware: MiddlewareHandler[] = [
    webpackDevMiddlewareHandler,
    // @ts-ignore as MiddlewareHandler
    webpackHotMiddleware(compiler),
    // @ts-ignore as MiddlewareHandler
    //compression(),
  ];
  
  const packageJson: PackageJson = await fs.readJson(path.join(cwd, 'package.json'));
  
  if (typeof packageJson.proxy === 'object' && packageJson.proxy) {
    const proxyConfigs: {[uri: string]: HttpProxyMiddlewareOptions} = packageJson.proxy as {[uri: string]: HttpProxyMiddlewareOptions};
    Object.keys(proxyConfigs).forEach(uri => {
      // @ts-ignore as MiddlewareHandler
      middleware.push(proxyMiddleware(uri, proxyConfigs[uri]));
    });
  }
  
  if (extend.serverSideRendering) {
    middleware.push(
      // @ts-ignore as MiddlewareHandler
      proxyMiddleware(['**', '!**/*.*'], {
        target: `http://localhost:${serverPort}`,
      }),
    );
  } else {
    middleware.push(
      // @ts-ignore as MiddlewareHandler
      function (req: IncomingMessage, res: ServerResponse, next: () => void) {
        if (req.url && !/\.[a-zA-Z0-9]+$/.test(req.url)) {
          if (fs.pathExistsSync(path.join(cwd, 'src', app, 'index.html'))) {
            req.url = '/index.html';
          } else if (fs.pathExistsSync(path.join(cwd, 'src', app, '200.html'))) {
            req.url = '/200.html';
          }
          webpackDevMiddlewareHandler(req, res, next);
        } else {
          next();
        }
      },
    );
  }
  
  const browserSyncConfig: Options = {
    port,
    open: false,
    ghostMode: false,
    //@ts-ignore missing type
    https,
    
    server: {
      baseDir: staticFileDirectories,
      middleware,
    },
    
    files: staticFileDirectories,
  };
  
  // create output directory if not exists for loadable-stats.json
  if (extend.serverSideRendering) await fs.mkdirp(path.join(output));
  
  // run browser-sync
  sayTitle('START BROWSER-SYNC + WEBPACK');
  browserSync(browserSyncConfig, error => {
    if (error) console.error(error);
  });
}