import webpack, { Configuration, Stats } from 'webpack';

export function runWebpack(webpackConfig: Configuration): Promise<Stats> {
  return new Promise<Stats>((resolve, reject) => {
    webpack(webpackConfig).run((error: Error, stats: Stats) => {
      if (error) {
        reject(error);
      } else {
        resolve(stats);
      }
    });
  });
}
