import { getWebpackRawLoaders } from '@rocket-scripts/react-preset/webpackLoaders/getWebpackRawLoaders';
import { getWebpackScriptLoaders } from '@rocket-scripts/react-preset/webpackLoaders/getWebpackScriptLoaders';
import { getWebpackYamlLoaders } from '@rocket-scripts/react-preset/webpackLoaders/getWebpackYamlLoaders';
import { eslintConfigExistsSync } from '@rocket-scripts/utils';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import fs from 'fs-extra';
import path from 'path';
import { Configuration, RuleSetRule, WatchIgnorePlugin } from 'webpack';

export interface MainWebpackConfigOptions {
  cwd: string;
  babelLoaderOptions: object;
  tsconfig: string;
}

export default function ({
  cwd,
  babelLoaderOptions,
  tsconfig,
}: MainWebpackConfigOptions): Configuration {
  return {
    target: 'electron-main',

    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
      mainFields: ['main'],
    },

    output: {
      libraryTarget: 'commonjs2',
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
            // ts, tsx, js, jsx - script
            ...getWebpackScriptLoaders({
              include: path.join(cwd, 'src'),
              babelLoaderOptions,
              useWebWorker: true,
              chunkPath: '',
              publicPath: '',
            }),

            // html, ejs, txt, md - plain text
            ...getWebpackRawLoaders(),

            // yaml, yml
            ...getWebpackYamlLoaders(),
          ],
        },
      ],
    },

    plugins: [
      // @ts-ignore TODO webpack5 definition error
      new WatchIgnorePlugin({ paths: [path.join(cwd, 'node_modules')] }),

      // @ts-ignore TODO webpack5 definition error
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

    resolveLoader: {
      modules: ['node_modules'],
    },
  };
}
