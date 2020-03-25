import { Observable, Observer, Subscribable } from 'rxjs';
import webpack, { Compiler, Configuration, Stats } from 'webpack';

export function watchWebpack(
  webpackConfig: Configuration,
  watchOptions: Compiler.WatchOptions = {},
): Subscribable<string> {
  return new Observable((observer: Observer<string>) => {
    const watching: Compiler.Watching = webpack(webpackConfig).watch(watchOptions, (error: Error, stats: Stats) => {
      if (error) {
        observer.error(error);
      } else {
        observer.next(
          stats.toString(
            typeof webpackConfig.stats === 'object'
              ? {
                  ...webpackConfig.stats,
                  colors: true,
                }
              : webpackConfig.stats,
          ),
        );
      }
    });

    return () => {
      watching.close(() => {
        // end watch
      });
    };
  });
}
