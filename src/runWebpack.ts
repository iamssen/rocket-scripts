import webpack, { Configuration, Stats } from 'webpack';
import { Config } from './types';

export = function (config: Config, webpackConfig: Configuration): Promise<void> {
  return new Promise((resolve: () => void, reject: (error: Error) => void) => {
    webpack(webpackConfig).run((error: Error, stats: Stats) => {
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