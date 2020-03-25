import webpack, { Configuration, Stats } from 'webpack';

export function runWebpack(webpackConfig: Configuration): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    webpack(webpackConfig).run((error: Error, stats: Stats) => {
      if (error) {
        reject(error);
      } else {
        resolve(
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
  });
}
