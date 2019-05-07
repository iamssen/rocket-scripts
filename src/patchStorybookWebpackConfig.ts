import path from 'path';
import { Configuration } from 'webpack';
import { getWebpackBasicLoaders } from './webpackConfigs/getWebpackBasicLoaders';
import { getWebpackStyleLoaders } from './webpackConfigs/getWebpackStyleLoaders';

const extractCss: boolean = false;

export function patchStorybookWebpackConfig({cwd = process.cwd(), config}: {cwd?: string, config: Configuration}) {
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
            configFile: path.join(cwd, 'tslint.json'),
            tsConfigFile: path.join(cwd, 'tsconfig.json'),
          },
        },
      ],
    },
    
    {
      oneOf: [
        // ts, tsx, js, jsx - script
        // html, ejs, txt, md - plain text
        ...getWebpackBasicLoaders({include: path.join(cwd, 'src')}),
        
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
      ],
    },
  );
  
  return config;
}