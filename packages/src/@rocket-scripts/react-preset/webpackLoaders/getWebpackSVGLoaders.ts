import { RuleSetCondition, RuleSetRule } from 'webpack';
import { ESBuildLoaderOptions } from './getWebpackScriptLoaders';

interface Params {
  test?: RuleSetCondition;
  chunkPath: string;
  esbuildLoaderOptions: ESBuildLoaderOptions;
}

export function getWebpackSVGLoaders({
  test = /\.svg$/,
  chunkPath,
  esbuildLoaderOptions,
}: Params): RuleSetRule[] {
  return [
    {
      test,
      use: [
        {
          loader: require.resolve('esbuild-loader'),
          options: {
            ...esbuildLoaderOptions,
            loader: 'jsx',
          } as ESBuildLoaderOptions,
        },
        {
          loader: require.resolve('@ssen/svg-react-loader'),
        },
        {
          loader: require.resolve('file-loader'),
          options: {
            name: `${chunkPath}[name].[contenthash].[ext]`,
          },
        },
      ],
    },
  ];
}
