import { RuleSetRule } from 'webpack';

export function getWebpackYamlLoaders(): RuleSetRule[] {
  return [
    {
      test: /\.(yaml|yml)$/,
      use: [require.resolve('json-loader'), require.resolve('yaml-loader')],
    },
  ];
}
