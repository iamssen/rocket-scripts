import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';
import { RuleSetRule, RuleSetUse, RuleSetUseItem } from 'webpack';

interface GetWebpackStyleLoadersParameters {
  cssRegex: RegExp;
  cssModuleRegex: RegExp;
  extractCss: boolean;
  preProcessor?: string;
}

export function getWebpackStyleLoaders({
  cssRegex,
  cssModuleRegex,
  extractCss,
  preProcessor,
}: GetWebpackStyleLoadersParameters): RuleSetRule[] {
  const styleLoader: RuleSetUseItem = extractCss ? MiniCssExtractPlugin.loader : require.resolve('style-loader');

  const postcssLoader: RuleSetUseItem = {
    loader: require.resolve('postcss-loader'),
    options: {
      // https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js#L99
      ident: 'postcss',
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009',
          },
          stage: 3,
        }),
        require('postcss-normalize')(),
      ],
      sourceMap: true,
    },
  };

  const use: RuleSetUse = [
    styleLoader,
    {
      loader: require.resolve('css-loader'),
      options: {
        url: false,
        importLoaders: preProcessor ? 2 : 1,
        sourceMap: true,
      },
    },
    postcssLoader,
  ];

  const moduleUse: RuleSetUse = [
    styleLoader,
    {
      loader: require.resolve('css-loader'),
      options: {
        url: false,
        importLoaders: preProcessor ? 2 : 1,
        sourceMap: true,
        modules: true,
        getLocalIdent: getCSSModuleLocalIdent,
      },
    },
    postcssLoader,
  ];

  if (preProcessor) {
    const preProcessorLoader: RuleSetUseItem = {
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: true,
        ...(preProcessor === 'less-loader' ? { javascriptEnabled: true } : {}),
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
