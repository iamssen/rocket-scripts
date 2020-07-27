import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import fs from 'fs-extra';
import path from 'path';
import resolve from 'resolve';
import { Configuration, HotModuleReplacementPlugin, RuleSetRule, WatchIgnorePlugin } from 'webpack';
import { eslintConfigExistsSync } from '../web/rules/eslintConfigExistsSync';
import { getWebpackDataURILoaders } from './webpackLoaders/getWebpackDataURILoaders';
import { getWebpackFileLoaders } from './webpackLoaders/getWebpackFileLoaders';
import { getWebpackMDXLoaders } from './webpackLoaders/getWebpackMDXLoaders';
import { getWebpackRawLoaders } from './webpackLoaders/getWebpackRawLoaders';
import { getWebpackScriptLoaders } from './webpackLoaders/getWebpackScriptLoaders';
import { getWebpackStyleLoaders } from './webpackLoaders/getWebpackStyleLoaders';
import { getWebpackYamlLoaders } from './webpackLoaders/getWebpackYamlLoaders';

interface Options {
  cwd: string;
  chunkPath: string;
  publicPath: string;
  babelLoaderOptions: object;
  tsconfig: string;
}

export default function ({
  cwd,
  chunkPath,
  publicPath,
  babelLoaderOptions,
  tsconfig,
}: Options): Configuration {
  return {
    //mode: 'development',
    //devtool: 'cheap-module-eval-source-map',

    //output: {
    //path: cwd,
    //publicPath,
    //filename: `${chunkPath}[name].js`,
    //chunkFilename: `${chunkPath}[name].js`,
    //  pathinfo: false,
    //},

    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.mdx'],
      //symlinks: false,
      //alias,
    },

    //entry: {
    //  ...entry.reduce((e, { name, index }) => {
    //    e[name] = path.join(cwd, 'src', app, index);
    //    return e;
    //  }, {}),
    //},

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
      //...entry.map(({ html }) => {
      //  return new HtmlWebpackPlugin({
      //    template: path.join(cwd, 'src', app, html),
      //    filename: html,
      //  });
      //}),

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

      //new InterpolateHtmlPlugin(HtmlWebpackPlugin, webpackEnv),
      //
      //new DefinePlugin({
      //  'process.env': Object.keys(webpackEnv).reduce((stringifiedEnv, key) => {
      //    stringifiedEnv[key] = JSON.stringify(webpackEnv[key]);
      //    return stringifiedEnv;
      //  }, {}),
      //}),
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
      hints: false,
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
  };
}
