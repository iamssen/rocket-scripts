import { eslintConfigExistsSync } from '@rocket-scripts/utils/eslintConfigExistsSync';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import fs from 'fs-extra';
import path from 'path';
import { Configuration, RuleSetRule, WatchIgnorePlugin } from 'webpack';
import { getWebpackDataURILoaders } from './webpackLoaders/getWebpackDataURILoaders';
import { getWebpackFileLoaders } from './webpackLoaders/getWebpackFileLoaders';
import { getWebpackMDXLoaders } from './webpackLoaders/getWebpackMDXLoaders';
import { getWebpackRawLoaders } from './webpackLoaders/getWebpackRawLoaders';
import { getWebpackScriptLoaders } from './webpackLoaders/getWebpackScriptLoaders';
import { getWebpackStyleLoaders } from './webpackLoaders/getWebpackStyleLoaders';
import { getWebpackYamlLoaders } from './webpackLoaders/getWebpackYamlLoaders';

export interface WebpackConfigOptions {
  cwd: string;
  chunkPath: string;
  publicPath: string;
  babelLoaderOptions: object;
  tsconfig: string;
  extractCss: boolean;
}

export default function ({
  cwd,
  chunkPath,
  publicPath,
  babelLoaderOptions,
  tsconfig,
  extractCss,
}: WebpackConfigOptions): Configuration {
  return {
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.mdx'],
    },

    module: {
      // makes missing exports an error instead of warning
      strictExportPresence: true,

      rules: [
        // enable eslint-loader if exists
        ...(() => {
          try {
            return eslintConfigExistsSync(cwd)
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
              : [];
          } catch {
            return [];
          }
        })(),
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
                  extractCss,
                }),
              ];

              try {
                if (require.resolve('node-sass').length > 0) {
                  styleLoaders.push(
                    ...getWebpackStyleLoaders({
                      cssRegex: /\.(scss|sass)$/,
                      cssModuleRegex: /\.module.(scss|sass)$/,
                      extractCss,
                      preProcessor: require.resolve('sass-loader'),
                    }),
                  );
                }
              } catch {}

              try {
                if (require.resolve('less').length > 0) {
                  styleLoaders.push(
                    ...getWebpackStyleLoaders({
                      cssRegex: /\.less$/,
                      cssModuleRegex: /\.module.less$/,
                      extractCss,
                      preProcessor: require.resolve('less-loader'),
                    }),
                  );
                }
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
      new WatchIgnorePlugin([path.join(cwd, 'node_modules')]),

      ...(fs.existsSync(tsconfig)
        ? [
            new ForkTsCheckerWebpackPlugin({
              async: false,
              typescript: {
                configFile: tsconfig,
                diagnosticOptions: {
                  semantic: true,
                  syntactic: true,
                },
                configOverwrite: {
                  compilerOptions: {
                    incremental: true,
                  },
                },
              },
              formatter: {
                type: 'codeframe',
                options: {
                  highlightCode: false,
                },
              },
            }),
          ]
        : []),
    ],

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
