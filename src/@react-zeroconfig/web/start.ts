import { fixChunkPath } from '@react-zeroconfig/web/rules/fixChunkPath';
import path from 'path';
import { Configuration } from 'webpack';

interface Params {
  cwd: string;
  app: string;
  outDir: string;

  publicPath?: string;
  chunkPath?: string; // relative path from output

  staticFileDirectories?: string[];

  sourceMap?: boolean;

  port?: 'auto' | number;
  https?: boolean | { key: symbol; cert: symbol };
}

export async function start({
  cwd,
  app,
  publicPath = '',
  chunkPath = '',
  staticFileDirectories = ['$CWD/public'],
  sourceMap = true,
  port = 'auto',
  https = false,
}: Params) {
  chunkPath = fixChunkPath(chunkPath);
  //staticFileDirectories =

  const hotMiddleware: string = path.dirname(require.resolve('webpack-hot-middleware/package.json'));

  const webpackConfig: Configuration = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',

    output: {
      path: cwd,
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.mdx'],
    },

    // miscellaneous configs
    resolveLoader: {
      modules: ['node_modules'],
    },

    performance: {
      hints: 'warning',
      maxEntrypointSize: 30000000,
      maxAssetSize: 20000000,
    },

    stats: {
      modules: false,
      maxModules: 0,
      errors: true,
      warnings: true,

      children: false,

      moduleTrace: true,
      errorDetails: true,
    },
  };
}
