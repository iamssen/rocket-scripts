import { Observable, Observer, Subscribable } from 'rxjs';
import webpack, { Compiler, Configuration } from 'webpack';
import { Config } from './types';

export = function (config: Config, webpackConfig: Configuration, watchOptions: Compiler.WatchOptions = {}): Subscribable<void> {
  return Observable.create((observer: Observer<void>) => {
    webpack(webpackConfig).watch(watchOptions, (error, stats) => {
      if (error) {
        observer.error(error);
      } else {
        console.log(stats.toString(
          typeof webpackConfig.stats === 'object'
            ? {
              ...webpackConfig.stats,
              colors: true,
            }
            : webpackConfig.stats,
        ));
        
        observer.next();
      }
    });
  });
};