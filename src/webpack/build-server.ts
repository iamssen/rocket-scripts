import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Configuration } from 'webpack';
import { Config } from '../types';

interface Params {
  isProduction: boolean;
}

export = ({isProduction}: Params) => ({app}: Config): Promise<Configuration> => {
  return Promise.resolve({
    plugins: [
      new MiniCssExtractPlugin({
        filename: `[name].css`,
      }),
    ],
  });
};