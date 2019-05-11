import { RuleSetCondition, RuleSetRule } from 'webpack';

export function getWebpackBasicLoaders({include, babelConfig}: {include: RuleSetCondition, babelConfig: object}): RuleSetRule[] {
  return [
    // babel
    {
      test: /\.(ts|tsx|js|jsx)$/,
      include,
      loader: require.resolve('babel-loader'),
      options: {
        babelrc: false,
        configFile: false,
        ...babelConfig,
      },
    },
    
    // import text
    {
      test: /\.(html|ejs|txt|md)$/,
      include,
      use: [
        require.resolve('raw-loader'),
      ],
    },
  ];
}