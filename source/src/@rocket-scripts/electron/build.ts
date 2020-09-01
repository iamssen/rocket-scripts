import { getBrowserslistQuery } from '@rocket-scripts/browserslist';
import {
  mainWebpackConfig as webpackReactElectronMainConfig,
  rendererWebpackConfig as webpackReactElectronRendererConfig,
} from '@rocket-scripts/react-electron-preset';
import { getWebpackAlias, icuFormat } from '@rocket-scripts/utils';
import { filterReactEnv } from '@rocket-scripts/web/utils/filterReactEnv';
import fs from 'fs-extra';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import path from 'path';
import safePostCssParser from 'postcss-safe-parser';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack, {
  Compiler,
  Configuration as WebpackConfiguration,
  DefinePlugin,
  Stats,
} from 'webpack';
import { merge as webpackMerge } from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import { BuildParams } from './params';

export async function build({
  cwd = process.cwd(),
  app,
  staticFileDirectories: _staticFileDirectories = ['{cwd}/public'],
  outDir: _outDir = '{cwd}/out/{app}',

  env = process.env,
  tsconfig: _tsconfig = '{cwd}/tsconfig.json',

  mainWebpackConfig: _mainWebpackConfig,
  rendererWebpackConfig: _rendererWebpackConfig,
  babelLoaderOptions: _babelLoaderOptions,
}: BuildParams) {
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
    ...filterReactEnv(env),
    PUBLIC_PATH: publicPath,
    PUBLIC_URL: publicPath,
    NODE_ENV: env['NODE_ENV'] || 'production',
  };

  const babelLoaderOptions: object = _babelLoaderOptions ?? {
    presets: [
      [
        require.resolve('@rocket-scripts/react-preset/babelPreset'),
        {
          modules: false,
          targets: getBrowserslistQuery({ cwd }),
        },
      ],
    ],
  };

  const mainWebpackConfig: WebpackConfiguration = webpackMerge(
    userMainWebpackConfig,
    webpackReactElectronMainConfig({
      cwd,
      babelLoaderOptions,
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
          new TerserPlugin({
            terserOptions: {
              ecma: 5,
              parse: {
                ecma: 8,
              },
              compress: {
                //ecma: 5,
                warnings: false,
                comparisons: false,
                inline: 2,
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                ascii_only: true,
              },
            },
            parallel: true,
            cache: true,
            sourceMap: true,
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
            {} as NodeJS.ProcessEnv,
          ),
        }),
      ],
    },
  );

  const rendererWebpackConfig: WebpackConfiguration = webpackMerge(
    userRendererWebpackConfig,
    webpackReactElectronRendererConfig({
      cwd,
      tsconfig,
      babelLoaderOptions,
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
          new TerserPlugin({
            terserOptions: {
              ecma: 5,
              parse: {
                ecma: 8,
              },
              compress: {
                //ecma: 5,
                warnings: false,
                comparisons: false,
                inline: 2,
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                ascii_only: true,
              },
            },
            parallel: true,
            cache: true,
            sourceMap: true,
          }),
          new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
              parser: safePostCssParser,
              map: {
                inline: false,
                annotation: true,
              },
            },
            cssProcessorPluginOptions: {
              preset: [
                'default',
                { minifyFontValues: { removeQuotes: false } },
              ],
            },
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
        }),

        new HtmlWebpackPlugin({
          template: path.join(cwd, `src/${app}/index.html`),
          filename: 'index.html',
        }),

        new InterpolateHtmlPlugin(
          HtmlWebpackPlugin,
          webpackEnv as Record<string, string>,
        ),

        new DefinePlugin({
          'process.env': Object.keys(webpackEnv).reduce(
            (stringifiedEnv, key) => {
              stringifiedEnv[key] = JSON.stringify(webpackEnv[key]);
              return stringifiedEnv;
            },
            {} as NodeJS.ProcessEnv,
          ),
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

  await new Promise((resolve, reject) => {
    mainCompiler.run((error: Error, stats: Stats) => {
      if (error) {
        reject(error);
      } else {
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
      }
    });
  });

  await new Promise((resolve, reject) => {
    rendererCompiler.run((error: Error, stats: Stats) => {
      if (error) {
        reject(error);
      } else {
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
      }
    });
  });
}
