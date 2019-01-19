import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import path from 'path';
import safePostCssParser from 'postcss-safe-parser';
import TerserPlugin from 'terser-webpack-plugin';
import { Configuration } from 'webpack';
import { Config } from '../types';

interface Params {
  isProduction: boolean;
}

export = ({isProduction}: Params) => ({app, appDirectory}: Config): Promise<Configuration> => {
  return Promise.resolve({
    entry: app.entry.reduce((entry, entryItemName) => {
      entry[entryItemName] = path.join(appDirectory, 'src/_entry/client', entryItemName);
      return entry;
    }, {}),
    
    optimization: {
      concatenateModules: isProduction,
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 5,
            parse: {
              ecma: 8,
            },
            compress: {
              //ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          parallel: true,
          cache: true,
          sourceMap: true,
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: isProduction
              ? {
                inline: false,
                annotation: true,
              }
              : false,
          },
        }),
      ],
    },
    
    plugins: [
      new MiniCssExtractPlugin({
        filename: `${app.buildPath}[name].css`,
        chunkFilename: `${app.buildPath}[name].css`,
      }),
    ],
  });
};