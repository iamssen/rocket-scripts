import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { getWebpackBasicLoaders } from './getWebpackBasicLoaders';
import { getWebpackStyleLoaders } from './getWebpackStyleLoaders';

export function createPackageWebpackConfig({name, cwd, file, externals}: {name: string, cwd: string, file: string, externals: string[]}): Configuration {
  const extractCss: boolean = true;
  
  return {
    entry: () => file,
    
    externals: [nodeExternals(), ...externals],
    
    output: {
      path: path.join(cwd, 'dist/packages', name),
      filename: 'index.js',
      libraryTarget: 'commonjs',
    },
    
    optimization: {
      concatenateModules: true,
    },
    
    module: {
      rules: [
        {
          oneOf: [
            // ts, tsx, js, jsx - script
            // html, ejs, txt, md - plain text
            ...getWebpackBasicLoaders({include: path.join(cwd, 'src/_packages', name)}),
            
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
      ],
    },
    
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'index.css',
      }),
    ],
  };
}