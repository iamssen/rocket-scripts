import path from 'path';
import { Configuration } from 'webpack';
import getDefaultLoaders from './utils/webpack/getDefaultLoaders';
import getStyleLoaders from './utils/webpack/getStyleLoaders';

const appDirectory: string = process.cwd();
const extractCss: boolean = false;

export = ({config}: {config: Configuration}) => {
  config.resolve!.extensions!.push('.ts', '.tsx');
  
  config.module!.rules.push(
    // tslint
    {
      test: /\.(ts|tsx)?$/,
      enforce: 'pre',
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
        ...getDefaultLoaders(path.join(appDirectory, 'src')),
        
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
  );
  
  return config;
};