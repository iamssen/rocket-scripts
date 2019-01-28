import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin-alt';
import path from 'path';
import typescriptFormatter from 'react-dev-utils/typescriptFormatter';
import resolve from 'resolve';
import webpack, { Configuration } from 'webpack';
import getAlias from '../getAlias';
import getDefaultLoaders from '../getDefaultLoaders';
import { Config } from '../types';

export = () => (config: Config): Promise<Configuration> => {
  const { app, appDirectory } = config;
  
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
            
            ...getDefaultLoaders(path.join(appDirectory, 'src')),
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