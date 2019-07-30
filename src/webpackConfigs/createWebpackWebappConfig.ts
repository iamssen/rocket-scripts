import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin-alt';
import fs from 'fs-extra';
import path from 'path';
import typescriptFormatter from 'react-dev-utils/typescriptFormatter';
import resolve from 'resolve';
import { Configuration, RuleSetRule } from 'webpack';
import { getWebpackAlias } from './getWebpackAlias';
import { getWebpackDataURILoaders } from './getWebpackDataURILoaders';
import { getWebpackFileLoaders } from './getWebpackFileLoaders';
import { getWebpackMDXLoaders } from './getWebpackMDXLoaders';
import { getWebpackRawLoaders } from './getWebpackRawLoaders';
import { getWebpackScriptLoaders } from './getWebpackScriptLoaders';
import { getWebpackStyleLoaders } from './getWebpackStyleLoaders';

export function createWebpackWebappConfig({extractCss, cwd, chunkPath, publicPath}: {extractCss: boolean, cwd: string, chunkPath: string, publicPath: string}): Configuration {
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
        ] as RuleSetRule[] : []),
        
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
    ],
  };
}