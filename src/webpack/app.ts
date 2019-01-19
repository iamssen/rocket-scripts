import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin-alt';
import path from 'path';
import typescriptFormatter from 'react-dev-utils/typescriptFormatter';
import resolve from 'resolve';
import webpack, { Configuration } from 'webpack';
import getAlias from '../getAlias';
import { Config } from '../types';

export = () => (config: Config): Promise<Configuration> => {
  const {app, appDirectory} = config;
  
  const enforce: 'pre' = 'pre';
  
  return Promise.resolve({
    resolve: {
      alias: getAlias(config),
    },
    
    module: {
      strictExportPresence: true,
      
      rules: [
        // tslint
        {
          test: /\.(ts|tsx)?$/,
          enforce,
          use: [
            {
              loader: require.resolve('tslint-loader'),
              options: {
                configFile: path.join(appDirectory, 'tslint.json'),
                tsConfigFile: path.join(appDirectory, 'tsconfig.json'),
              },
            },
          ],
        },
        
        {
          oneOf: [
            // convert files to data url
            {
              test: [/\.png$/],
              include: path.join(appDirectory, 'src'),
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: `${app.buildPath}[name].[ext]`,
              },
            },
            
            // babel
            {
              test: /\.(ts|tsx|jsx)$/,
              include: path.join(appDirectory, 'src'),
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                presets: [
                  [
                    require.resolve('@babel/preset-env'),
                    {
                      targets: {
                        ie: 9,
                      },
                      ignoreBrowserslistConfig: true,
                      useBuiltIns: false,
                      modules: false,
                      exclude: ['transform-typeof-symbol'],
                    },
                  ],
                  [
                    require.resolve('@babel/preset-react'),
                    {
                      useBuiltIns: true,
                    },
                  ],
                  require.resolve('@babel/preset-typescript'),
                ],
                plugins: [
                  require.resolve('@babel/plugin-transform-destructuring'),
                  [
                    require.resolve('@babel/plugin-proposal-decorators'),
                    {
                      legacy: false,
                      decoratorsBeforeExport: true,
                    },
                  ],
                  [
                    require.resolve('@babel/plugin-proposal-class-properties'),
                    {
                      loose: true,
                    },
                  ],
                  [
                    require.resolve('@babel/plugin-proposal-object-rest-spread'),
                    {
                      useBuiltIns: true,
                    },
                  ],
                  require.resolve('babel-plugin-dynamic-import-webpack'),
                ],
                overrides: [
                  {
                    test: /\.(ts|tsx)$/,
                    plugins: [
                      [
                        require.resolve('@babel/plugin-proposal-decorators'),
                        {
                          legacy: true,
                        },
                      ],
                    ],
                  },
                ],
              },
            },
            
            {
              test: /\.svg$/,
              include: path.join(appDirectory, 'src'),
              use: [
                require.resolve('svg-react-loader'),
              ],
            },
            
            // import text
            {
              test: /\.html$/,
              include: path.join(appDirectory, 'src'),
              use: [
                require.resolve('raw-loader'),
              ],
            },
            {
              test: /\.ejs$/,
              include: path.join(appDirectory, 'src'),
              use: [
                require.resolve('raw-loader'),
              ],
            },
            {
              test: /\.txt$/,
              include: path.join(appDirectory, 'src'),
              use: [
                require.resolve('raw-loader'),
              ],
            },
            {
              test: /\.md$/,
              include: path.join(appDirectory, 'src'),
              use: [
                require.resolve('raw-loader'),
                require.resolve('markdown-loader'),
              ],
            },
          ],
        },
      ],
    },
    
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: resolve.sync('typescript', {
          basedir: path.join(appDirectory, 'node_modules'),
        }),
        async: false,
        checkSyntacticErrors: true,
        tsconfig: path.join(appDirectory, 'tsconfig.json'),
        reportFiles: [
          '**',
          '!**/*.json',
          '!**/__tests__/**',
          '!**/?(*.)(spec|test).*',
          '!**/src/setupProxy.*',
          '!**/src/setupTests.*',
        ],
        watch: path.join(appDirectory, 'src'),
        silent: true,
        formatter: typescriptFormatter,
      }),
      new webpack.DefinePlugin({
        'process.env.SSR_PORT': JSON.stringify(app.ssrPort),
      }),
    ],
  });
};