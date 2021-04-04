import { eslintConfigExistsSync } from '@rocket-scripts/utils/eslintConfigExistsSync';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import fs from 'fs-extra';
import path from 'path';
import { Configuration, RuleSetRule, WatchIgnorePlugin } from 'webpack';
import { getWebpackDataURILoaders } from './webpackLoaders/getWebpackDataURILoaders';
import { getWebpackFileLoaders } from './webpackLoaders/getWebpackFileLoaders';
import { getWebpackMDXLoaders } from './webpackLoaders/getWebpackMDXLoaders';
import { getWebpackRawLoaders } from './webpackLoaders/getWebpackRawLoaders';
import {
  ESBuildLoaderOptions,
  getWebpackScriptLoaders,
} from './webpackLoaders/getWebpackScriptLoaders';
import { getWebpackStyleLoaders } from './webpackLoaders/getWebpackStyleLoaders';
import { getWebpackSVGLoaders } from './webpackLoaders/getWebpackSVGLoaders';
import { getWebpackYamlLoaders } from './webpackLoaders/getWebpackYamlLoaders';

export interface WebpackConfigOptions {
  cwd: string;
  chunkPath: string;
  publicPath: string;
  esbuildLoaderOptions: ESBuildLoaderOptions;
  tsconfig: string;
  extractCss: boolean;
  tsConfigIncludes: string[];
}

export default function ({
  cwd,
  chunkPath,
  publicPath,
  esbuildLoaderOptions,
  tsconfig,
  extractCss,
  tsConfigIncludes,
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
              esbuildLoaderOptions,
              useWebWorker: true,
              chunkPath,
              publicPath,
            }),

            // svg - script
            ...getWebpackSVGLoaders({
              chunkPath,
              esbuildLoaderOptions,
            }),

            // mdx - script
            ...getWebpackMDXLoaders({
              include: path.join(cwd, 'src'),
              esbuildLoaderOptions,
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

              styleLoaders.push(
                ...getWebpackStyleLoaders({
                  cssRegex: /\.(scss|sass)$/,
                  cssModuleRegex: /\.module.(scss|sass)$/,
                  extractCss,
                  preProcessor: require.resolve('sass-loader'),
                }),
              );

              styleLoaders.push(
                ...getWebpackStyleLoaders({
                  cssRegex: /\.less$/,
                  cssModuleRegex: /\.module.less$/,
                  extractCss,
                  preProcessor: require.resolve('less-loader'),
                }),
              );

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
      new WatchIgnorePlugin({ paths: [path.join(cwd, 'node_modules')] }),

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
                  include: tsConfigIncludes,
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
  };
}
