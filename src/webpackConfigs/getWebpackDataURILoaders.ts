import { RuleSetRule } from 'webpack';

export function getWebpackDataURILoaders({chunkPath}: {chunkPath: string}): RuleSetRule[] {
  return [
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        name: `${chunkPath}[name].[hash].[ext]`,
      },
    },
  ];
}