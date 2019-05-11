import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin-alt';
import fs from 'fs-extra';
import path from 'path';
import typescriptFormatter from 'react-dev-utils/typescriptFormatter';
import resolve from 'resolve';
import { Configuration, DefinePlugin } from 'webpack';
import { getBabelConfig } from '../transpile/getBabelConfig';
import { getWebpackAlias } from './getWebpackAlias';
import { getWebpackBasicLoaders } from './getWebpackBasicLoaders';
import { getWebpackStyleLoaders } from './getWebpackStyleLoaders';

export function createWebappWebpackConfig({extractCss, cwd, serverPort, publicPath}: {extractCss: boolean, cwd: string, serverPort: number, publicPath: string}): Configuration {
  const tsconfig: string = path.join(cwd, 'tsconfig.json');
  const tslint: string = path.join(cwd, 'tslint.json');
  
  return {
    resolve: {
      alias: getWebpackAlias({cwd}),
    },
    
    module: {
      strictExportPresence: true,
      
      rules: [
        // tslint
        ...(fs.pathExistsSync(tsconfig) && fs.pathExistsSync(tslint) ? [
          {
            test: /\.(ts|tsx)?$/,
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
        ] as Configuration : []),
        
        {
          oneOf: [
            // convert files to data url
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: `static/[name].[hash].[ext]`,
              },
            },
            
            // ts, tsx, js, jsx - script
            // html, ejs, txt, md - plain text
            ...getWebpackBasicLoaders({
              include: path.join(cwd, 'src'),
              babelConfig: getBabelConfig({
                cwd,
                modules: false,
              }),
            }),
            
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
            {
              loader: require.resolve('file-loader'),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: `static/[name].[hash].[ext]`,
              },
            },
          ],
        },
      ],
    },
    
    plugins: [
      ...(fs.pathExistsSync(tsconfig) ? [
        new ForkTsCheckerWebpackPlugin({
          typescript: resolve.sync('typescript', {
            basedir: path.join(cwd, 'node_modules'),
          }),
          async: false,
          checkSyntacticErrors: true,
          tsconfig,
          reportFiles: [
            '**',
            '!**/*.json',
            '!**/__tests__/**',
            '!**/?(*.)(spec|test).*',
            '!**/src/setupProxy.*',
            '!**/src/setupTests.*',
          ],
          watch: path.join(cwd, 'src'),
          silent: true,
          formatter: typescriptFormatter,
        }),
      ] : []),
      
      new DefinePlugin({
        'process.env.SERVER_PORT': JSON.stringify(serverPort),
        'process.env.PUBLIC_PATH': JSON.stringify(publicPath),
      }),
    ],
  };
}