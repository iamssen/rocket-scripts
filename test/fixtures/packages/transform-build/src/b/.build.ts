import { TransformCompilerOptions, TransformWebpackConfig } from '@react-zeroconfig/packages';

export const transformCompilerOptions = ((compilerOptions) => {
  return {
    ...compilerOptions,
    removeComments: true,
  };
}) as TransformCompilerOptions;

export const transformWebpackConfig = ((webpackConfig) => {
  return {
    ...webpackConfig,
    stats: 'minimal',
  };
}) as TransformWebpackConfig;
