import path from 'path';
import { RuleSetCondition, RuleSetLoader, RuleSetRule } from 'webpack';
import { getBabelConfig } from '../transpile/getBabelConfig';

export function getWebpackMDXLoaders({
  test = /\.mdx$/,
  cwd,
  mdxLoaderOptions = {},
  targets,
}: {
  test?: RuleSetCondition;
  cwd: string;
  mdxLoaderOptions?: object;
  targets?: string | string[];
}): RuleSetRule[] {
  const src: string = path.join(cwd, 'src');
  const babelLoader: RuleSetLoader = {
    loader: require.resolve('babel-loader'),
    options: {
      babelrc: false,
      configFile: false,
      ...getBabelConfig({
        cwd,
        modules: false,
        targets,
      }),
    },
  };

  return [
    {
      test,
      include: src,
      use: [
        babelLoader,
        {
          loader: require.resolve('@mdx-js/loader'),
          options: mdxLoaderOptions,
        },
      ],
    },
  ];
}
