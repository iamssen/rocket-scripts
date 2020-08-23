import { Configuration } from 'webpack';
import { getWebpackAlias } from '@rocket-scripts/utils';
import { merge } from 'webpack-merge';

export interface WebpackFinalParams {
  cwd?: string;
}

export const webpackFinal = ({ cwd = process.cwd() }: WebpackFinalParams) => async (
  config: Configuration,
): Promise<Configuration> => {
  const alias = getWebpackAlias(cwd);

  return merge(config, {
    resolve: {
      alias,
    },
  });
};
