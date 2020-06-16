import { getBrowserslistQuery } from '@rocket-scripts/browserslist';
import { icuFormat } from '@rocket-scripts/rule';
import {
  getWebpackDataURILoaders,
  getWebpackFileLoaders,
  getWebpackMDXLoaders,
  getWebpackRawLoaders,
  getWebpackScriptLoaders,
  getWebpackStyleLoaders,
  getWebpackYamlLoaders,
} from '@rocket-scripts/webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import fs from 'fs-extra';
import getPort from 'get-port';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Color, render } from 'ink';
import path from 'path';
import React, { useEffect, useMemo } from 'react';
import resolve from 'resolve';
import { PackageJson } from 'type-fest';
import webpack, {
  Compiler,
  Configuration as WebpackConfiguration,
  DefinePlugin,
  HotModuleReplacementPlugin,
  RuleSetRule,
  WatchIgnorePlugin,
} from 'webpack';
import WebpackDevServer, { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { eslintConfigExistsSync } from './rules/eslintConfigExistsSync';
import { fixChunkPath } from './rules/fixChunkPath';
import { AppEntry } from './rules/getAppEntry';
import { InterpolateHtmlPlugin } from './rules/InterpolateHtmlPlugin';
import { useAppEntry } from './rules/useAppEntry';
import { ProxyConfig, useProxyConfig } from './rules/useProxyConfig';
import { useWebpackAlias } from './rules/useWebpackAlias';

export interface StartPrams {
  cwd: string;
  app: string;
  outDir: string;

  publicPath?: string;
  /** relative path from output */
  chunkPath?: string;

  externals?: string[];
  staticFileDirectories?: string[];

  port?: 'random' | number;
  https?: boolean | { key: string; cert: string };

  env?: NodeJS.ProcessEnv;
}

export type StartProps = Required<Omit<StartPrams, 'port'>> & {
  appDir: string;
  port: number;
};

export function Start({
  cwd,
  app,
  outDir,
  publicPath,
  chunkPath,
  staticFileDirectories,
  externals,
  port,
  https,
  appDir,
  env,
}: StartProps) {
  const entry: AppEntry[] | null = useAppEntry({ appDir });

  const proxyConfig: ProxyConfig | undefined = useProxyConfig(cwd);

  const alias: Record<string, string> = useWebpackAlias(cwd);

  const reactAppEnv: NodeJS.ProcessEnv = useMemo(() => {
    return Object.keys(env)
      .filter((key) => /^REACT_APP_/i.test(key))
      .reduce((e, key) => {
        e[key] = env[key];
        return e;
      }, {});
  }, [env]);

  // ---------------------------------------------
  // webpack
  // ---------------------------------------------
  const compiler: Compiler.Watching | Compiler | null = useMemo(() => {
    if (!entry) return null;

    //const hotMiddleware: string = path.dirname(require.resolve('webpack-hot-middleware/package.json'));

    const webpackEnv: Record<string, string | number | boolean> = {
      ...reactAppEnv,
      PUBLIC_PATH: publicPath,
      PUBLIC_URL: publicPath,
      NODE_ENV: env['NODE_ENV'] || 'development',
    };

    const babelLoaderOptions: object = {
      presets: [
        [
          require.resolve('@rocket-scripts/babel-preset'),
          {
            modules: false,
            targets: getBrowserslistQuery({ cwd }),
          },
        ],
      ],
      plugins: [
        require.resolve('@loadable/babel-plugin'),

        [
          require.resolve('babel-plugin-named-asset-import'),
          {
            loaderMap: {
              svg: {
                ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]',
              },
            },
          },
        ],

        ...(() => {
          try {
            return [require.resolve('@handbook/babel-plugin')];
          } catch {
            return [];
          }
        })(),

        ...(() => {
          const { dependencies }: PackageJson = fs.readJsonSync(path.join(cwd, 'package.json'));
          if (!dependencies) return [];

          const pluginImports: [string, object, string][] = [];

          if (dependencies['antd']) {
            pluginImports.push([
              require.resolve('babel-plugin-import'),
              {
                libraryName: 'antd',
              },
              'tree-shaking-antd',
            ]);
          }

          if (dependencies['@material-ui/core']) {
            pluginImports.push([
              require.resolve('babel-plugin-import'),
              {
                libraryName: '@material-ui/core',
                libraryDirectory: '',
                camel2DashComponentName: false,
              },
              'tree-shaking-mui-core',
            ]);
          }

          if (dependencies['@material-ui/icons']) {
            pluginImports.push([
              require.resolve('babel-plugin-import'),
              {
                libraryName: '@material-ui/icons',
                libraryDirectory: '',
                camel2DashComponentName: false,
              },
              'tree-shaking-mui-icons',
            ]);
          }

          return pluginImports;
        })(),
      ],
    };

    const webpackConfig: WebpackConfiguration = {
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
        extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.mdx'],
        symlinks: false,
        alias,
      },

      entry: {
        ...entry.reduce((e, { name, index }) => {
          //e[name] = [
          //  `${hotMiddleware}/client?path=/__webpack_hmr&timeout=20000&reload=true`,
          //  path.join(cwd, 'src', app, index),
          //];
          e[name] = path.join(cwd, 'src', app, index);
          return e;
        }, {}),
      },

      module: {
        strictExportPresence: true,

        rules: [
          ...(eslintConfigExistsSync(cwd)
            ? [
                {
                  test: /\.(js|mjs|jsx|ts|tsx)$/,
                  include: path.join(cwd, 'src'),
                  enforce: 'pre',
                  use: [
                    {
                      loader: require.resolve('eslint-loader'),
                      options: {
                        eslintPath: require.resolve('eslint'),
                        cwd,
                      },
                    },
                  ],
                } as RuleSetRule,
              ]
            : []),
          {
            oneOf: [
              // convert small image files to data uri
              ...getWebpackDataURILoaders({ chunkPath }),

              // ts, tsx, js, jsx - script
              ...getWebpackScriptLoaders({
                include: path.join(cwd, 'src'),
                babelLoaderOptions,
                useWebWorker: true,
                chunkPath,
                publicPath,
              }),

              // mdx - script
              ...getWebpackMDXLoaders({
                include: path.join(cwd, 'src'),
                babelLoaderOptions,
              }),

              // html, ejs, txt, md - plain text
              ...getWebpackRawLoaders(),

              // yaml, yml
              ...getWebpackYamlLoaders(),

              // css, scss, sass, less - style
              // module.* - css module
              ...(() => {
                const styleLoaders: RuleSetRule[] = [
                  ...getWebpackStyleLoaders({
                    cssRegex: /\.css$/,
                    cssModuleRegex: /\.module.css$/,
                    extractCss: false,
                  }),
                ];

                try {
                  styleLoaders.push(
                    ...getWebpackStyleLoaders({
                      cssRegex: /\.(scss|sass)$/,
                      cssModuleRegex: /\.module.(scss|sass)$/,
                      extractCss: false,
                      preProcessor: require.resolve('sass-loader'),
                    }),
                  );
                } catch {}

                try {
                  styleLoaders.push(
                    ...getWebpackStyleLoaders({
                      cssRegex: /\.less$/,
                      cssModuleRegex: /\.module.less$/,
                      extractCss: false,
                      preProcessor: require.resolve('less-loader'),
                    }),
                  );
                } catch {}

                return styleLoaders;
              })(),

              // export files to static directory
              ...getWebpackFileLoaders({
                chunkPath,
              }),
            ],
          },
        ],
      },

      plugins: [
        new HotModuleReplacementPlugin(),

        new WatchIgnorePlugin([path.join(cwd, 'node_modules')]),

        // create html files
        ...entry.map(({ html }) => {
          return new HtmlWebpackPlugin({
            template: path.join(cwd, 'src', app, html),
            filename: html,
          });
        }),

        ...(fs.existsSync(path.join(cwd, 'tsconfig.json'))
          ? [
              new ForkTsCheckerWebpackPlugin({
                typescript: resolve.sync('typescript', {
                  basedir: path.join(cwd, 'node_modules'),
                }),
                async: false,
                useTypescriptIncrementalApi: true,
                checkSyntacticErrors: true,
                measureCompilationTime: true,
                tsconfig: path.join(cwd, 'tsconfig.json'),
                reportFiles: ['**', '!**/*.json', '!**/__*', '!**/?(*.)(spec|test).*'],
                silent: true,
                //formatter: process.env.NODE_ENV === 'production' ? 'default' : undefined,
              }),
            ]
          : []),

        new InterpolateHtmlPlugin(HtmlWebpackPlugin, webpackEnv),

        new DefinePlugin({
          'process.env': Object.keys(webpackEnv).reduce((stringifiedEnv, key) => {
            stringifiedEnv[key] = JSON.stringify(webpackEnv[key]);
            return stringifiedEnv;
          }, {}),
        }),
      ],

      optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,

        moduleIds: 'named',
        noEmitOnErrors: true,
      },

      // miscellaneous configs
      resolveLoader: {
        modules: ['node_modules'],
      },

      performance: {
        hints: 'warning',
        maxEntrypointSize: 30000000,
        maxAssetSize: 20000000,
      },

      node: {
        module: 'empty',
        dgram: 'empty',
        dns: 'mock',
        fs: 'empty',
        http2: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
      },

      stats: {
        modules: false,
        maxModules: 0,
        errors: true,
        warnings: true,

        children: false,

        moduleTrace: true,
        errorDetails: true,
      },
    };

    return webpack(webpackConfig);

    //const webpackDevMiddlewareHandler = webpackDevMiddleware(compiler, {
    //  publicPath: publicPath,
    //  stats: { colors: true },
    //});
    //
    //const middleware: MiddlewareHandler[] = [
    //  // @ts-ignore as MiddlewareHandler
    //  webpackDevMiddlewareHandler,
    //  // @ts-ignore as MiddlewareHandler
    //  webpackHotMiddleware(compiler),
    //];
    //
    //if (proxyConfig) {
    //  Object.keys(proxyConfig).forEach((uri) => {
    //    // @ts-ignore as MiddlewareHandler
    //    middleware.push(createProxyMiddleware(uri, proxyConfigs[uri]));
    //  });
    //}
    //
    //const rewriteMiddleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    //  if (req.url && !/\.[a-zA-Z0-9]+$/.test(req.url)) {
    //    if (fs.pathExistsSync(path.join(cwd, 'src', app, 'index.html'))) {
    //      req.url = '/index.html';
    //    } else if (fs.pathExistsSync(path.join(cwd, 'src', app, '200.html'))) {
    //      req.url = '/200.html';
    //    }
    //    webpackDevMiddlewareHandler(req, res, next);
    //  } else {
    //    next();
    //  }
    //};
    //
    //// @ts-ignore as MiddlewareHandler
    //middleware.push(rewriteMiddleware);
    //
    //return middleware;
  }, [alias, app, chunkPath, cwd, entry, env, publicPath, reactAppEnv]);

  // ---------------------------------------------
  // webpack dev server
  // ---------------------------------------------
  const devServerConfig: WebpackDevServerConfiguration | null = useMemo(() => {
    return {
      hot: true,
      compress: true,
      contentBase: staticFileDirectories,
      //https, TODO
    };
  }, [staticFileDirectories]);

  useEffect(() => {
    if (!compiler || !devServerConfig) return;

    const devServer = new WebpackDevServer(compiler, devServerConfig);

    devServer.listen(port, 'localhost', (err) => {
      if (err) {
        return console.log(err);
      }
      //if (isInteractive) {
      //  clearConsole();
      //}

      console.log('Starting the development server...\n');
    });

    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];

    function shutdown() {
      devServer.close();
      process.exit();
    }

    for (const signal of signals) {
      process.on(signal, shutdown);
    }

    return () => {
      devServer.close();

      for (const signal of signals) {
        process.off(signal, shutdown);
      }
    };
  }, [compiler, devServerConfig, port]);

  return (
    <>
      <Color>Hello?</Color>
    </>
  );
}

export async function start({
  cwd,
  app,
  outDir: _outDir,
  publicPath = '',
  chunkPath: _chunkPath = '',
  staticFileDirectories: _staticFileDirectories = ['{cwd}/public'],
  externals = [],
  port: _port = 'random',
  https = false,
  env = {},
}: StartPrams): Promise<StartProps & { abort: () => void }> {
  const outDir: string = icuFormat(_outDir, { cwd, app });
  const chunkPath: string = fixChunkPath(_chunkPath);
  const port: number =
    typeof _port === 'number' ? _port : await getPort({ port: getPort.makeRange(8000, 9999) });
  const staticFileDirectories: string[] = _staticFileDirectories.map((dir) => icuFormat(dir, { cwd, app }));
  const appDir: string = path.join(cwd, 'src', app);

  const props: StartProps = {
    cwd,
    app,
    outDir,
    publicPath,
    chunkPath,
    staticFileDirectories,
    externals,
    port,
    https,
    appDir,
    env,
  };

  const { unmount } = render(<Start {...props} />);

  return {
    ...props,
    abort: unmount,
  };
}
