import fs from 'fs-extra';
import path from 'path';
import { Configuration } from 'webpack';
import { getBabelConfig } from './transpile/getBabelConfig';
import { getWebpackBasicLoaders } from './webpackConfigs/getWebpackBasicLoaders';
import { getWebpackStyleLoaders } from './webpackConfigs/getWebpackStyleLoaders';

const extractCss: boolean = false;

export function patchStorybookWebpackConfig({cwd = process.cwd(), config}: {cwd?: string, config: Configuration}) {
  const tsconfig: string = path.join(cwd, 'tsconfig.json');
  const tslint: string = path.join(cwd, 'tslint.json');
  
  config.resolve!.extensions!.push('.ts', '.tsx');
  
  config.module!.rules.push(
    // tslint
    ...(fs.pathExistsSync(tsconfig) && fs.pathExistsSync(tslint) ? [
      {
        test: /\.(ts|tsx)?$/,
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
      ],
    },
  );
  
  return config;
}