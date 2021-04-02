import { ESBuildLoaderOptions } from './getWebpackScriptLoaders';
import { RuleSetCondition, RuleSetRule } from 'webpack';

interface Params {
  test?: RuleSetCondition;
  include: RuleSetCondition;
  esbuildLoaderOptions: ESBuildLoaderOptions;
  mdxLoaderOptions?: object;
}

export function getWebpackMDXLoaders({
  test = /\.mdx$/,
  include,
  esbuildLoaderOptions,
  mdxLoaderOptions = {},
}: Params): RuleSetRule[] {
  return [
    {
      test,
      include,
      use: [
        {
          loader: require.resolve('esbuild-loader'),
          options: {
            ...esbuildLoaderOptions,
            loader: 'jsx',
          } as ESBuildLoaderOptions,
        },
        {
          loader: require.resolve('@mdx-js/loader'),
          options: mdxLoaderOptions,
        },
        {
          loader: require.resolve('@ssen/mdx-matter-loader'),
        },
      ],
    },
  ];
}
