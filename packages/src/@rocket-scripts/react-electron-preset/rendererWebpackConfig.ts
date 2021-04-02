import reactWebpackConfig, {
  WebpackConfigOptions,
} from '@rocket-scripts/react-preset/webpackConfig';
import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';

export interface RendererWebpackConfigOptions extends WebpackConfigOptions {}

export default function ({
  cwd,
  esbuildLoaderOptions,
  chunkPath,
  publicPath,
  tsconfig,
  extractCss,
  tsConfigIncludes,
}: RendererWebpackConfigOptions): Configuration {
  return merge(
    reactWebpackConfig({
      cwd,
      esbuildLoaderOptions,
      chunkPath,
      publicPath,
      tsconfig,
      extractCss,
      tsConfigIncludes,
    }),
    {
      target: 'electron-renderer',
    },
  );
}
