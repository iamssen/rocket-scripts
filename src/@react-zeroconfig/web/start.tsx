import { icuFormat } from '@react-zeroconfig/rule';
import getPort from 'get-port';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Color, render } from 'ink';
import path from 'path';
import React, { useMemo } from 'react';
import { Configuration, HotModuleReplacementPlugin, WatchIgnorePlugin } from 'webpack';
import { fixChunkPath } from './rules/fixChunkPath';
import { AppEntry } from './rules/getAppEntry';
import { useAppEntry } from './rules/useAppEntry';

export interface StartPrams {
  cwd: string;
  app: string;
  outDir: string;

  publicPath?: string;
  /** relative path from output */
  chunkPath?: string;

  externals?: string[];
  staticFileDirectories?: string[];

  port?: 'random' | number;
  https?: boolean | { key: string; cert: string };
}

export type StartProps = Required<Omit<StartPrams, 'port'>> & {
  appDir: string;
  port: number;
};

export function Start({
  cwd,
  app,
  outDir,
  publicPath,
  chunkPath,
  staticFileDirectories,
  externals,
  port,
  https,
  appDir,
}: StartProps) {
  const entry: AppEntry[] | null = useAppEntry({ appDir });

  const webpackConfig: Configuration | null = useMemo(() => {
    if (!entry) return null;

    const hotMiddleware: string = path.dirname(require.resolve('webpack-hot-middleware/package.json'));

    return {
      mode: 'development',
      devtool: 'cheap-module-eval-source-map',

      output: {
        path: cwd,
        publicPath,
        filename: `${chunkPath}[name].js`,
        chunkFilename: `${chunkPath}[name].js`,
        pathinfo: false,
      },

      resolve: {
        extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.mdx'],
        symlinks: false,
      },

      entry: {
        ...entry.reduce((e, { name, index }) => {
          e[name] = [
            `${hotMiddleware}/client?path=/__webpack_hmr&timeout=20000&reload=true`,
            path.join(cwd, 'src', app, index),
          ];
          return e;
        }, {}),
      },

      plugins: [
        new HotModuleReplacementPlugin(),

        new WatchIgnorePlugin([path.join(cwd, 'node_modules')]),

        // create html files
        ...entry.map(({ html }) => {
          return new HtmlWebpackPlugin({
            template: path.join(cwd, 'src', app, html),
            filename: html,
          });
        }),
      ],

      optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,

        moduleIds: 'named',
        noEmitOnErrors: true,
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
  }, [app, chunkPath, cwd, entry, publicPath]);

  return (
    <>
      <Color>Hello?</Color>
    </>
  );
}

export async function start({
  cwd,
  app,
  outDir: _outDir,
  publicPath = '',
  chunkPath: _chunkPath = '',
  staticFileDirectories: _staticFileDirectories = ['{cwd}/public'],
  externals = [],
  port: _port = 'random',
  https = false,
}: StartPrams) {
  const outDir: string = icuFormat(_outDir, { cwd, app });
  const chunkPath: string = fixChunkPath(_chunkPath);
  const port: number = typeof _port === 'number' ? _port : await getPort({ port: getPort.makeRange(8000, 9999) });
  const staticFileDirectories: string[] = _staticFileDirectories.map((dir) => icuFormat(dir, { cwd, app }));

  const appDir: string = path.join(cwd, 'src', app);

  render(
    <Start
      cwd={cwd}
      app={app}
      outDir={outDir}
      publicPath={publicPath}
      chunkPath={chunkPath}
      staticFileDirectories={staticFileDirectories}
      externals={externals}
      port={port}
      https={https}
      appDir={appDir}
    />,
  );
}
