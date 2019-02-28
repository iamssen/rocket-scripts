import path from 'path';
import webpack, { Configuration } from 'webpack';
import { Config } from '../types';

export = () => ({app, appDirectory}: Config): Promise<Configuration> => {
  return Promise.resolve({
    entry: app.entry.reduce((entry: {[name: string]: string[]}, entryItemName: string) => {
      entry[entryItemName] = [
        `${path.dirname(require.resolve('webpack-hot-middleware/package.json'))}/client?http://localhost:${app.port}`,
        `${path.dirname(require.resolve('webpack/package.json'))}/hot/only-dev-server`,
        path.join(appDirectory, 'src/_entry', entryItemName),
      ];
      return entry;
    }, {}),
    
    optimization: {
      namedModules: true,
      noEmitOnErrors: true,
    },
    
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
  });
};