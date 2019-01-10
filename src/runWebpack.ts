import webpack, { Configuration } from 'webpack';
import { Config } from './types';

export = function (config: Config, webpackConfig: Configuration): Promise<void> {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((error, stats) => {
      if (error) {
        reject(error);
      } else {
        console.log(stats.toString(
          typeof webpackConfig.stats === 'object'
            ? {
              ...webpackConfig.stats,
              colors: true,
            }
            : webpackConfig.stats,
        ));
        
        resolve();
      }
    });
  });
}