import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';

export function createServerAppWebpackConfig({cwd, app}: {cwd: string, app: string}): Configuration {
  return {
    target: 'node',
    
    entry: {
      index: path.join(cwd, 'src', app, 'server'),
    },
    
    output: {
      libraryTarget: 'commonjs',
    },
    
    externals: [nodeExternals({
      // include asset files
      whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
    })],
    
    plugins: [
      new MiniCssExtractPlugin({
        filename: `[name].css`,
      }),
    ],
  };
}