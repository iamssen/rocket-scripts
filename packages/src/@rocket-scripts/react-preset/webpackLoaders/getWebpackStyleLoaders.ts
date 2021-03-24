import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';
import { RuleSetRule, RuleSetUse, RuleSetUseItem } from 'webpack';

interface GetWebpackStyleLoadersParameters {
  cssRegex: RegExp;
  cssModuleRegex: RegExp;
  extractCss: boolean;

  /** require.resolve('less-loader') */
  preProcessor?: string;
}

export function getWebpackStyleLoaders({
  cssRegex,
  cssModuleRegex,
  extractCss,
  preProcessor,
}: GetWebpackStyleLoadersParameters): RuleSetRule[] {
  const styleLoader: RuleSetUseItem = extractCss
    ? MiniCssExtractPlugin.loader
    : require.resolve('style-loader');

  const postcssLoader: RuleSetUseItem | undefined = (() => {
    try {
      return require.resolve('postcss').length > 0
        ? {
            loader: require.resolve('postcss-loader'),
            options: {
              // https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js#L99
              postcssOptions: {
                plugins: [
                  require('postcss-flexbugs-fixes'),
                  require('postcss-preset-env')({
                    autoprefixer: {
                      flexbox: 'no-2009',
                    },
                    stage: 3,
                  }),
                  require('postcss-normalize')(),
                ],
              },
              sourceMap: true,
            },
          }
        : undefined;
    } catch {
      return undefined;
    }
  })();

  const loaderCount: number = postcssLoader ? 1 : 0;

  const use: RuleSetUse = [
    styleLoader,
    {
      loader: require.resolve('css-loader'),
      options: {
        url: false,
        importLoaders: preProcessor ? 2 : loaderCount,
        sourceMap: true,
      },
    },
  ];

  const moduleUse: RuleSetUse = [
    styleLoader,
    {
      loader: require.resolve('css-loader'),
      options: {
        url: false,
        importLoaders: preProcessor ? 2 : loaderCount,
        sourceMap: true,
        modules: {
          getLocalIdent: getCSSModuleLocalIdent,
        },
      },
    },
  ];

  if (postcssLoader) {
    use.push(postcssLoader);
    moduleUse.push(postcssLoader);
  }

  if (preProcessor) {
    const preProcessorLoader: RuleSetUseItem = {
      loader: preProcessor,
      options: {
        sourceMap: true,
      },
    };

    use.push(preProcessorLoader);
    moduleUse.push(preProcessorLoader);
  }

  return [
    {
      test: cssModuleRegex,
      use: moduleUse,
    },
    {
      test: cssRegex,
      use,
    },
  ];
}
