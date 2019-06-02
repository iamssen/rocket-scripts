import { RuleSetRule } from 'webpack';

export function getWebpackRawLoaders(): RuleSetRule[] {
  return [
    {
      test: /\.(html|ejs|txt|md)$/,
      use: [
        require.resolve('raw-loader'),
      ],
    },
  ];
}