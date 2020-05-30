export function transformWebpackConfig(webpackConfig) {
  return {
    ...webpackConfig,
    stats: 'minimal',
  };
}
