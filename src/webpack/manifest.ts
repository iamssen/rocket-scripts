import { Configuration } from 'webpack';
import ManifestPlugin from 'webpack-manifest-plugin';
import { Config } from '../types';

export = (filename: string) => ({app}: Config): Promise<Configuration> => {
  return Promise.resolve({
    plugins: [
      new ManifestPlugin({
        fileName: `${app.buildPath}${filename}`,
        publicPath: app.publicPath,
      }),
    ],
  });
};