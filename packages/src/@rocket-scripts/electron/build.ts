import {
  mainWebpackConfig as webpackReactElectronMainConfig,
  rendererWebpackConfig as webpackReactElectronRendererConfig,
} from '@rocket-scripts/react-electron-preset';
import { ESBuildLoaderOptions } from '@rocket-scripts/react-preset/webpackLoaders/getWebpackScriptLoaders';
import { getWebpackAlias, icuFormat } from '@rocket-scripts/utils';
import { filterReactEnv } from '@rocket-scripts/web/utils/filterReactEnv';
import { ESBuildMinifyPlugin } from 'esbuild-loader';
import fs from 'fs-extra';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import webpack, {
  Compiler,
  Configuration as WebpackConfiguration,
  DefinePlugin,
  Stats,
  WebpackPluginInstance,
} from 'webpack';
import { merge as webpackMerge } from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import { BuildParams } from './params';

export async function build({
  cwd = process.cwd(),
  app,
  staticFileDirectories: _staticFileDirectories = ['{cwd}/public'],
  outDir: _outDir = '{cwd}/out/{app}',

  tsconfig: _tsconfig = '{cwd}/tsconfig.json',

  mainWebpackConfig: _mainWebpackConfig,
  rendererWebpackConfig: _rendererWebpackConfig,
  esbuildLoaderOptions: _esbuildLoaderOptions,
}: BuildParams) {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
  }

  const staticFileDirectories: string[] = _staticFileDirectories.map((dir) =>
    icuFormat(dir, { cwd, app }),
  );
  const outDir: string = icuFormat(_outDir, { cwd, app });
  const tsconfig: string = icuFormat(_tsconfig, { cwd, app });
  const alias = getWebpackAlias(cwd);
  const publicPath: string = '';
  const chunkPath: string = '';

  const userMainWebpackConfig: WebpackConfiguration | {} =
    typeof _mainWebpackConfig === 'string'
      ? require(icuFormat(_mainWebpackConfig, { cwd, app }))
      : _mainWebpackConfig ?? {};

  const userRendererWebpackConfig: WebpackConfiguration | {} =
    typeof _rendererWebpackConfig === 'string'
      ? require(icuFormat(_rendererWebpackConfig, { cwd, app }))
      : _rendererWebpackConfig ?? {};

  const webpackEnv: NodeJS.ProcessEnv = {
    ...filterReactEnv(process.env),
    PUBLIC_PATH: publicPath,
    PUBLIC_URL: publicPath,
    NODE_ENV: process.env.NODE_ENV,
  };

  const esbuildLoaderOptions: ESBuildLoaderOptions = {
    target: 'es2019',
    loader: 'tsx',
    tsconfigRaw: {},
    ..._esbuildLoaderOptions,
  };

  const mainWebpackConfig: WebpackConfiguration = webpackMerge(
    userMainWebpackConfig,
    webpackReactElectronMainConfig({
      cwd,
      esbuildLoaderOptions,
      tsconfig,
    }),
    {
      mode: 'production',

      output: {
        path: outDir,
        filename: `[name].js`,
        chunkFilename: `[name].js`,
        pathinfo: false,
      },

      resolve: {
        symlinks: false,
        alias,
      },

      entry: {
        main: path.join(cwd, `src/${app}/main`),
        preload: path.join(cwd, `src/${app}/preload`),
      },

      externals: [
        nodeExternals({
          allowlist: [
            // include asset files
            /\.(?!(?:jsx?|json)$).{1,5}$/i,
          ],
        }),
      ],

      optimization: {
        concatenateModules: true,
        minimize: true,
        minimizer: [
          new ESBuildMinifyPlugin({
            target: esbuildLoaderOptions.target,
            minify: true,
          }),
        ],
      },

      plugins: [
        new DefinePlugin({
          'process.env': Object.keys(webpackEnv).reduce(
            (stringifiedEnv, key) => {
              stringifiedEnv[key] = JSON.stringify(webpackEnv[key]);
              return stringifiedEnv;
            },
            {} as Record<string, string>,
          ),

          global: JSON.stringify([]),
        }),
      ],
    },
  );

  const rendererWebpackConfig: WebpackConfiguration = webpackMerge(
    userRendererWebpackConfig,
    webpackReactElectronRendererConfig({
      cwd,
      tsconfig,
      esbuildLoaderOptions,
      chunkPath,
      publicPath,
      extractCss: true,
    }),
    {
      mode: 'production',

      output: {
        path: outDir,
        filename: `[name].js`,
        chunkFilename: `[name].js`,
        pathinfo: false,
      },

      resolve: {
        symlinks: false,
        alias,
      },

      entry: {
        renderer: path.join(cwd, `src/${app}/renderer`),
      },

      optimization: {
        concatenateModules: true,
        minimize: true,
        minimizer: [
          new ESBuildMinifyPlugin({
            target: esbuildLoaderOptions.target,
            minify: true,
            css: true,
          }),
        ],

        splitChunks: {
          cacheGroups: {
            // vendor chunk
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all',
            },

            // extract single css file
            style: {
              test: (m) => m.constructor.name === 'CssModule',
              name: 'style',
              chunks: 'all',
              enforce: true,
            },
          },
        },
      },

      plugins: [
        new MiniCssExtractPlugin({
          filename: `[name].css`,
        }) as WebpackPluginInstance,

        new HtmlWebpackPlugin({
          template: path.join(cwd, `src/${app}/index.html`),
          filename: 'index.html',
        }),

        new InterpolateHtmlPlugin(
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          HtmlWebpackPlugin as any,
          webpackEnv as Record<string, string>,
        ) as WebpackPluginInstance,

        new DefinePlugin({
          'process.env': Object.keys(webpackEnv).reduce(
            (stringifiedEnv, key) => {
              stringifiedEnv[key] = JSON.stringify(webpackEnv[key]);
              return stringifiedEnv;
            },
            {} as Record<string, string>,
          ),

          global: JSON.stringify([]),
        }),
      ],
    },
  );

  await fs.mkdirp(outDir);
  await Promise.all(
    staticFileDirectories.map((dir) =>
      fs.copy(dir, outDir, { dereference: true }),
    ),
  );

  const mainCompiler: Compiler = webpack(mainWebpackConfig);
  const rendererCompiler: Compiler = webpack(rendererWebpackConfig);

  await new Promise<void>((resolve, reject) => {
    mainCompiler.run((error?: Error, stats?: Stats) => {
      if (error) {
        reject(error);
      } else if (stats) {
        console.log(
          stats.toString(
            typeof mainWebpackConfig.stats === 'object'
              ? {
                  colors: true,
                }
              : mainWebpackConfig.stats ?? { colors: true },
          ),
        );
        resolve();
      } else {
        throw new Error('No error and stats');
      }
    });
  });

  await new Promise<void>((resolve, reject) => {
    rendererCompiler.run((error?: Error, stats?: Stats) => {
      if (error) {
        reject(error);
      } else if (stats) {
        console.log(
          stats.toString(
            typeof rendererWebpackConfig.stats === 'object'
              ? {
                  colors: true,
                }
              : rendererWebpackConfig.stats ?? { colors: true },
          ),
        );
        resolve();
      } else {
        throw new Error('No error and stats');
      }
    });
  });
}
