import { RuleSetRule } from 'webpack';

export function getWebpackFileLoaders({chunkPath}: {chunkPath: string}): RuleSetRule[] {
  return [
    {
      loader: require.resolve('file-loader'),
      exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.(html|txt|md|ejs)$/, /\.json$/],
      options: {
        name: `${chunkPath}/[name].[hash].[ext]`,
      },
    },
  ];
}