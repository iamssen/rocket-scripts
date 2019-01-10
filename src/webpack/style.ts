import { Configuration } from 'webpack';
import { Config } from '../types';
import getStyleLoaders from '../getStyleLoaders';

interface Params {
  extractCss: boolean;
}

export = ({extractCss}: Params) => ({}: Config): Promise<Configuration> => {
  return Promise.resolve({
    module: {
      rules: [
        {
          oneOf: [
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
          ],
        },
      ],
    },
  });
};