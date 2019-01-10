import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';
import { RuleSetRule, RuleSetUse, RuleSetUseItem } from 'webpack';

export = function (cssRegex: RegExp, cssModuleRegex: RegExp, extractCSS: boolean, preProcessor: string | null = null): RuleSetRule[] {
  const styleLoader: RuleSetUseItem = extractCSS
    ? MiniCssExtractPlugin.loader
    : require.resolve('style-loader');
  
  const postcssLoader: RuleSetUseItem = {
    loader: require.resolve('postcss-loader'),
    options: {
      ident: 'postcss',
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009',
          },
          stage: 3,
        }),
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
      },
    };
    
    use.push(preProcessorLoader);
    moduleUse.push(preProcessorLoader);
  }
  
  return [
    {
      test: cssRegex,
      exclude: cssModuleRegex,
      use,
    },
    {
      test: cssModuleRegex,
      use: moduleUse,
    },
  ];
};