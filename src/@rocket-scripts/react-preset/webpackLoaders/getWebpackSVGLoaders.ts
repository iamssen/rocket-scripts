import { RuleSetCondition, RuleSetRule } from 'webpack';

interface Params {
  test?: RuleSetCondition;
  include: RuleSetCondition;
  babelLoaderOptions: object;
  reactSvgLoaderOptions?: object;
}

export function getWebpackSVGLoaders({
  test = /\.svg$/,
  include,
  babelLoaderOptions,
  reactSvgLoaderOptions = { jsx: true },
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
          loader: require.resolve('react-svg-loader'),
          options: reactSvgLoaderOptions,
        },
      ],
    },
  ];
}
