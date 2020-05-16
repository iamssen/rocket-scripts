import { RuleSetCondition, RuleSetRule } from 'webpack';

interface Params {
  test?: RuleSetCondition;
  include: RuleSetCondition;
  babelLoaderOptions: object;
  mdxLoaderOptions?: object;
}

export function getWebpackMDXLoaders({
  test = /\.mdx$/,
  include,
  babelLoaderOptions,
  mdxLoaderOptions = {},
}: Params): RuleSetRule[] {
  return [
    {
      test,
      include,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: babelLoaderOptions,
        },
        {
          loader: require.resolve('@mdx-js/loader'),
          options: mdxLoaderOptions,
        },
      ],
    },
  ];
}
