import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import getDefaultLoaders from '../getDefaultLoaders';
import { Config, ModuleBuildOption } from '../types';

interface Params {
  buildOption: ModuleBuildOption;
}

export = ({buildOption}: Params) => ({appDirectory}: Config): Promise<Configuration> => {
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
            ...getDefaultLoaders(path.join(appDirectory, `src/_modules/${buildOption.name}`)),
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