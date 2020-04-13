import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import fs from 'fs-extra';
import path from 'path';
import resolve from 'resolve';
import { Configuration, RuleSetRule } from 'webpack';
import { eslintConfigExistsSync } from './eslintConfigExistsSync';
import { getWebpackAlias } from './getWebpackAlias';
import { getWebpackDataURILoaders } from './getWebpackDataURILoaders';
import { getWebpackFileLoaders } from './getWebpackFileLoaders';
import { getWebpackMDXLoaders } from './getWebpackMDXLoaders';
import { getWebpackRawLoaders } from './getWebpackRawLoaders';
import { getWebpackScriptLoaders } from './getWebpackScriptLoaders';
import { getWebpackStyleLoaders } from './getWebpackStyleLoaders';
import { getWebpackYamlLoaders } from './getWebpackYamlLoaders';

export function createWebpackWebappConfig({
  extractCss,
  cwd,
  chunkPath,
  publicPath,
  internalEslint,
}: {
  extractCss: boolean;
  cwd: string;
  chunkPath: string;
  publicPath: string;
  internalEslint: boolean;
}): Configuration {
  const tsconfig: string = path.join(cwd, 'tsconfig.json');
  const tslint: string = path.join(cwd, 'tslint.json');
  const eslintConfigExists: boolean = eslintConfigExistsSync({ cwd });

  return {
    resolve: {
      alias: getWebpackAlias({ cwd }),
    },

    module: {
      strictExportPresence: true,

      rules: [
        // tslint
        ...(fs.pathExistsSync(tsconfig) && fs.pathExistsSync(tslint)
          ? ([
              {
                test: /\.(ts|tsx)$/,
                include: path.join(cwd, 'src'),
                enforce: 'pre',
                use: [
                  {
                    loader: require.resolve('tslint-loader'),
                    options: {
                      configFile: tslint,
                      tsConfigFile: tsconfig,
                    },
                  },
                ],
              },
            ] as RuleSetRule[])
          : []),

        // eslint
        ...((): RuleSetRule[] => {
          if (eslintConfigExists) {
            return [
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
              },
            ];
          } else if (internalEslint) {
            return [
              {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                include: path.join(cwd, 'src'),
                enforce: 'pre',
                use: [
                  {
                    loader: require.resolve('eslint-loader'),
                    options: {
                      cache: true,
                      eslintPath: require.resolve('eslint'),
                      resolvePluginsRelativeTo: __dirname,
                      baseConfig: {
                        extends: [require.resolve('eslint-config-react-app')],
                      },
                      ignore: false,
                      useEslintrc: false,
                    },
                  },
                ],
              },
            ];
          } else {
            return [];
          }
        })(),

        {
          oneOf: [
            // convert files to data url
            ...getWebpackDataURILoaders({
              chunkPath,
            }),

            // ts, tsx, js, jsx - script
            ...getWebpackScriptLoaders({
              cwd,
              useWebWorker: true,
              chunkPath,
              publicPath,
            }),

            // mdx - script
            ...getWebpackMDXLoaders({
              cwd,
            }),

            // html, ejs, txt, md - plain text
            ...getWebpackRawLoaders(),

            // yaml, yml
            ...getWebpackYamlLoaders(),

            // css, scss, sass, less - style
            // module.* - css module
            ...getWebpackStyleLoaders({
              cssRegex: /\.css$/,
              cssModuleRegex: /\.module.css$/,
              extractCss,
            }),

            ...getWebpackStyleLoaders({
              cssRegex: /\.(scss|sass)$/,
              cssModuleRegex: /\.module.(scss|sass)$/,
              extractCss,
              preProcessor: 'sass-loader',
            }),

            ...getWebpackStyleLoaders({
              cssRegex: /\.less$/,
              cssModuleRegex: /\.module.less$/,
              extractCss,
              preProcessor: 'less-loader',
            }),

            // export files to static directory
            ...getWebpackFileLoaders({
              chunkPath,
            }),
          ],
        },
      ],
    },

    plugins: [
      ...(fs.pathExistsSync(tsconfig)
        ? [
            new ForkTsCheckerWebpackPlugin({
              typescript: resolve.sync('typescript', {
                basedir: path.join(cwd, 'node_modules'),
              }),
              async: false,
              useTypescriptIncrementalApi: true,
              checkSyntacticErrors: true,
              measureCompilationTime: true,
              tsconfig,
              reportFiles: [
                '**',
                '!**/*.json',
                '!**/__tests__/**',
                '!**/?(*.)(spec|test).*',
                '!**/src/setupProxy.*',
                '!**/src/setupTests.*',
              ],
              silent: true,
              //formatter: process.env.NODE_ENV === 'production' ? 'default' : undefined,
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
