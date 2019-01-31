import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import getDefaultLoaders from '../getDefaultLoaders';
import getStyleLoaders from '../getStyleLoaders';
import { Config, ModuleBuildOption } from '../types';

interface Params {
  buildOption: ModuleBuildOption;
  extractCss: boolean;
}

export = ({buildOption, extractCss}: Params) => ({appDirectory}: Config): Promise<Configuration> => {
  const libraryTarget: 'commonjs' = 'commonjs';
  
  return Promise.resolve({
    entry: () => buildOption.file,
    
    externals: [nodeExternals(), ...buildOption.externals],
    
    output: {
      path: path.join(appDirectory, `dist/modules/${buildOption.name}`),
      filename: 'index.js',
      libraryTarget,
    },
    
    optimization: {
      concatenateModules: true,
    },
    
    module: {
      rules: [
        {
          oneOf: [
            //// convert files to data url
            //{
            //  test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            //  loader: require.resolve('url-loader'),
            //  options: {
            //    limit: 10000,
            //    name: 'public/[name].[hash:8].[ext]',
            //  },
            //},
            
            ...getDefaultLoaders(path.join(appDirectory, `src/_modules/${buildOption.name}`)),
            
            ...getStyleLoaders(
              /\.css$/,
              /\.module.css$/,
              extractCss,
            ),
            ...getStyleLoaders(
              /\.(scss|sass)$/,
              /\.module.(scss|sass)$/,
              extractCss,
              'sass-loader',
            ),
            ...getStyleLoaders(
              /\.less$/,
              /\.module.less$/,
              extractCss,
              'less-loader',
            ),
            
            //// export files to static directory
            //{
            //  loader: require.resolve('file-loader'),
            //  exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            //  options: {
            //    name: 'public/[name].[hash:8].[ext]',
            //  },
            //},
          ],
        },
      ],
    },
    
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'index.css',
      }),
    ],
  });
};