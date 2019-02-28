import { RuleSetCondition, RuleSetRule } from 'webpack';
import getBabelConfig from '../babel/getBabelConfig';

export = function (include: RuleSetCondition): RuleSetRule[] {
  return [
    // babel
    {
      test: /\.(ts|tsx|js|jsx)$/,
      include,
      loader: require.resolve('babel-loader'),
      options: {
        babelrc: false,
        configFile: false,
        ...getBabelConfig({
          modules: false,
        }),
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