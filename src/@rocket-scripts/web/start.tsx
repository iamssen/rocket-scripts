import { getBrowserslistQuery } from '@rocket-scripts/browserslist';
import { icuFormat } from '@rocket-scripts/rule';
import { useWebpackAlias } from '@rocket-scripts/use-webpack-alias';
import {
  getWebpackDataURILoaders,
  getWebpackFileLoaders,
  getWebpackMDXLoaders,
  getWebpackRawLoaders,
  getWebpackScriptLoaders,
  getWebpackStyleLoaders,
  getWebpackYamlLoaders,
} from '@rocket-scripts/webpack';
import { patchConsole } from '@ssen/patch-console';
import { useJsonConfig } from '@ssen/use-json-config';
import { useWebpackDevServer } from '@ssen/use-webpack-dev-server';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import fs from 'fs-extra';
import getPort from 'get-port';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Color, render, Text } from 'ink';
import path from 'path';
import React, { useMemo } from 'react';
import resolve from 'resolve';
import tmp from 'tmp';
import { PackageJson } from 'type-fest';
import webpack, {
  Compiler,
  Configuration as WebpackConfiguration,
  DefinePlugin,
  HotModuleReplacementPlugin,
  RuleSetRule,
  WatchIgnorePlugin,
} from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { eslintConfigExistsSync } from './rules/eslintConfigExistsSync';
import { fixChunkPath } from './rules/fixChunkPath';
import { AppEntry } from './rules/getAppEntry';
import { InterpolateHtmlPlugin } from './rules/InterpolateHtmlPlugin';
import { useAppEntry } from './rules/useAppEntry';
import { ProxyConfig } from './rules/useProxyConfig';

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
  hostname?: string;
  https?: boolean | { key: string; cert: string };

  env?: NodeJS.ProcessEnv;
  tsconfig?: string;

  stdout?: NodeJS.WriteStream;
  stdin?: NodeJS.ReadStream;
}

// TODO message types
export type StartMessage =
  | {
      type: 'start';
    }
  | {
      type: 'restart';
    }
  | {
      type: 'error';
    };

export type StartProps = Required<Omit<StartPrams, 'port' | 'stdout' | 'stdin'>> & {
  appDir: string;
  port: number;
  logFile: string;
  onMessage: (message: StartMessage) => void;
};

export function getWebpackEnv({
  publicPath,
  env,
}: {
  publicPath: string;
  env: NodeJS.ProcessEnv;
}): Record<string, string | number | boolean> {
  const reactAppEnv: NodeJS.ProcessEnv = Object.keys(env)
    .filter((key) => /^REACT_APP_/i.test(key))
    .reduce((e, key) => {
      e[key] = env[key];
      return e;
    }, {});

  return {
    ...reactAppEnv,
    PUBLIC_PATH: publicPath,
    PUBLIC_URL: publicPath,
    NODE_ENV: env['NODE_ENV'] || 'development',
  };
}

export function getBabelLoaderOptions({ cwd }: { cwd: string }): object {
  return {
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
}

export function getWebpackConfig({
  cwd,
  app,
  publicPath,
  chunkPath,
  entry,
  alias,
  babelLoaderOptions,
  webpackEnv,
  tsconfig,
}: {
  cwd: string;
  app: string;
  publicPath: string;
  chunkPath: string;
  entry: AppEntry[];
  alias: Record<string, string>;
  babelLoaderOptions: object;
  webpackEnv: Record<string, string | number | boolean>;
  tsconfig: string;
}): WebpackConfiguration {
  return {
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

      ...(fs.existsSync(tsconfig)
        ? [
            new ForkTsCheckerWebpackPlugin({
              //typescript: {
              //  configFile: tsconfig,
              //},
              typescript: resolve.sync('typescript', {
                basedir: path.join(cwd, 'node_modules'),
              }),
              async: false,
              useTypescriptIncrementalApi: true,
              checkSyntacticErrors: true,
              measureCompilationTime: true,
              tsconfig,
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
}

const proxySelector = (object) => object?.proxy;

export function Start({
  cwd,
  app,
  // TODO is this using?
  outDir,
  publicPath,
  chunkPath,
  staticFileDirectories,
  // TODO
  externals,
  port,
  hostname,
  // TODO
  https,
  appDir,
  env,
  tsconfig,
  logFile,
}: StartProps) {
  const entry: AppEntry[] = useAppEntry({ appDir });

  const proxyConfig: ProxyConfig | undefined = useJsonConfig<ProxyConfig>({
    file: path.join(cwd, 'package.json'),
    selector: proxySelector,
  });

  const alias: Record<string, string> = useWebpackAlias(cwd);

  const webpackEnv: Record<string, string | number | boolean> = useMemo(
    () => getWebpackEnv({ publicPath, env }),
    [publicPath, env],
  );

  const babelLoaderOptions: object = useMemo(() => getBabelLoaderOptions({ cwd }), [cwd]);

  const webpackConfig: WebpackConfiguration | null = useMemo(() => {
    if (!entry) return null;

    return getWebpackConfig({
      cwd,
      app,
      publicPath,
      chunkPath,
      entry,
      alias,
      webpackEnv,
      babelLoaderOptions,
      tsconfig,
    });
  }, [alias, app, babelLoaderOptions, chunkPath, cwd, entry, publicPath, tsconfig, webpackEnv]);

  // ---------------------------------------------
  // webpack
  // ---------------------------------------------
  const compiler: Compiler | null = useMemo(() => {
    if (!entry || !webpackConfig) return null;

    // TODO .webpack.ts (WebpackConfig) => WebpackConfig
    return webpack(webpackConfig);
  }, [entry, webpackConfig]);

  // ---------------------------------------------
  // webpack dev server
  // ---------------------------------------------
  const devServerConfig: WebpackDevServerConfiguration | null = useMemo(() => {
    return {
      hot: true,
      compress: true,
      contentBase: staticFileDirectories,
      stats: {
        colors: false,
      },
      proxy: proxyConfig,

      // TODO https
      // TODO rewrite - fallback history
      // TODO .devServer.ts (WebpackDevServerConfiguration) => WebpackDevServerConfiguration
    };
  }, [proxyConfig, staticFileDirectories]);

  useWebpackDevServer(port, hostname, compiler, devServerConfig);

  return (
    <>
      <Text>{logFile}</Text>
      <Text>{port}</Text>
      <Text>{JSON.stringify(entry)}</Text>
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
  hostname = 'localhost',
  https = false,
  env = {},
  tsconfig: _tsconfig = '{cwd}/tsconfig.json',
  stdout = process.stdout,
  stdin = process.stdin,
}: StartPrams): Promise<StartProps & { waitServerStart: () => Promise<void>; close: () => void }> {
  const { name: logFile } = tmp.fileSync({ mode: 0o644, postfix: '.log' });

  const outDir: string = icuFormat(_outDir, { cwd, app });
  const chunkPath: string = fixChunkPath(_chunkPath);
  const port: number =
    typeof _port === 'number' ? _port : await getPort({ port: getPort.makeRange(8000, 9999) });
  const staticFileDirectories: string[] = _staticFileDirectories.map((dir) => icuFormat(dir, { cwd, app }));
  const appDir: string = path.join(cwd, 'src', app);
  const tsconfig: string = icuFormat(_tsconfig, { cwd, app });

  const props: StartProps = {
    cwd,
    app,
    outDir,
    publicPath,
    chunkPath,
    staticFileDirectories,
    externals,
    port,
    hostname,
    https,
    appDir,
    env,
    tsconfig,
    logFile,
    // TODO
    onMessage: (message) => {
      console.log('start.tsx..onMessage()', message);
    },
  };

  console.log(JSON.stringify(props, null, 2));

  const restoreConsole = patchConsole({ stdout: fs.createWriteStream(logFile), colorMode: 'auto' });

  const { unmount } = render(<Start {...props} />, { stdout, stdin });

  let closed: boolean = false;

  return {
    ...props,
    waitServerStart: () =>
      new Promise<void>((resolve) => {
        // TODO
        setTimeout(resolve, 5000);
      }),
    close: () =>
      new Promise((resolve) => {
        if (closed) return;
        unmount();
        restoreConsole();
        closed = true;
        setTimeout(resolve, 5000);
      }),
  };
}
