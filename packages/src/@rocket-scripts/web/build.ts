import { getBrowserslistQuery } from '@rocket-scripts/browserslist';
import webpackReactConfig from '@rocket-scripts/react-preset/webpackConfig';
import { getWebpackAlias, icuFormat } from '@rocket-scripts/utils';
import { exec } from 'child_process';
import fs from 'fs-extra';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import os from 'os';
import path from 'path';
import safePostCssParser from 'postcss-safe-parser';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack, {
  Configuration as WebpackConfiguration,
  DefinePlugin,
  MultiCompiler,
  WebpackPluginInstance,
} from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge as webpackMerge } from 'webpack-merge';
import { BuildParams } from './params';
import { filterReactEnv } from './utils/filterReactEnv';
import { getAppEntry } from './utils/getAppEntry';

export async function build({
  cwd = process.cwd(),
  app,
  staticFileDirectories: _staticFileDirectories = ['{cwd}/public'],
  outDir: _outDir = '{cwd}/out/{app}',

  isolatedScripts,

  openBundleSizeReport = false,

  tsconfig: _tsconfig = '{cwd}/tsconfig.json',

  webpackConfig: _webpackConfig,
  babelLoaderOptions: _babelLoaderOptions,

  devtool = 'source-map',
}: BuildParams) {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
  }

  const outDir: string = icuFormat(_outDir, { cwd, app });
  const staticFileDirectories: string[] = _staticFileDirectories.map((dir) =>
    icuFormat(dir, { cwd, app }),
  );
  const appDir: string = path.join(cwd, 'src', app);
  const tsconfig: string = icuFormat(_tsconfig, { cwd, app });
  const alias = getWebpackAlias(cwd);
  const entry = getAppEntry({ appDir });
  const publicPath: string = '';
  const chunkPath: string = '';

  const userWebpackConfig: WebpackConfiguration | {} =
    typeof _webpackConfig === 'string'
      ? require(icuFormat(_webpackConfig, { cwd, app }))
      : _webpackConfig ?? {};

  const webpackEnv: NodeJS.ProcessEnv = {
    ...filterReactEnv(process.env),
    PUBLIC_PATH: publicPath,
    PUBLIC_URL: publicPath,
    NODE_ENV: process.env.NODE_ENV,
  };

  const babelLoaderOptions: object = _babelLoaderOptions ?? {
    presets: [
      [
        require.resolve('@rocket-scripts/react-preset/babelPreset'),
        {
          modules: false,
          targets: getBrowserslistQuery({ cwd, env: 'production' }),
        },
      ],
    ],
  };

  const baseWebpackConfig: WebpackConfiguration = webpackMerge([
    userWebpackConfig,
    webpackReactConfig({
      chunkPath,
      publicPath,
      cwd,
      tsconfig,
      babelLoaderOptions,
      extractCss: true,
    }),
    {
      mode: 'production',
      devtool,

      resolve: {
        symlinks: false,
        alias,
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
        }),
      ],
    },
  ]);

  const appWebpackConfig: WebpackConfiguration = webpackMerge([
    baseWebpackConfig,
    {
      output: {
        path: outDir,
        publicPath,
        filename: `${chunkPath}[name].[fullhash].js`,
        chunkFilename: `${chunkPath}[name].[fullhash].js`,
        pathinfo: false,
      },

      entry: entry.reduce((e, { name, index }) => {
        e[name] = path.join(cwd, 'src', app, index);
        return e;
      }, {} as Record<string, string>),

      optimization: {
        concatenateModules: true,
        minimize: true,
        minimizer: [
          (new TerserPlugin({
            terserOptions: {
              ecma: 5,
              parse: {
                ecma: 2017,
              },
              compress: {
                //ecma: 5,
                drop_console: true,
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
          }) as unknown) as WebpackPluginInstance,
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
          }) as WebpackPluginInstance,
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
              test: (m: object) => m.constructor.name === 'CssModule',
              name: 'style',
              chunks: 'all',
              enforce: true,
            },
          },
        },
      },

      plugins: [
        // create css files
        new MiniCssExtractPlugin({
          filename: `${chunkPath}[name].[fullhash].css`,
          chunkFilename: `${chunkPath}[name].[fullhash].css`,
        }) as WebpackPluginInstance,

        // create size report
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: path.join(outDir, 'size-report.html'),
          openAnalyzer: false,
        }),

        //create html files
        ...entry.map(
          ({ html, name }) =>
            (new HtmlWebpackPlugin({
              template: path.join(cwd, 'src', app, html),
              filename: html,
              chunks: [name],
            }) as unknown) as WebpackPluginInstance,
        ),

        new InterpolateHtmlPlugin(
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          HtmlWebpackPlugin as any,
          webpackEnv as Record<string, string>,
        ) as WebpackPluginInstance,
      ],
    },
  ]);

  const webpackConfigs: WebpackConfiguration[] = [appWebpackConfig];

  if (isolatedScripts) {
    const files = Object.keys(isolatedScripts);

    for (const file of files) {
      webpackConfigs.push(
        webpackMerge(baseWebpackConfig, {
          output: {
            path: outDir,
            publicPath,
            filename: `${chunkPath}[name].js`,
            chunkFilename: `${chunkPath}[name].js`,
            pathinfo: false,
          },

          entry: {
            [file]: path.join(cwd, 'src', app, isolatedScripts[file]),
          },

          optimization: {
            concatenateModules: true,
            minimize: true,
            minimizer: [
              (new TerserPlugin({
                terserOptions: {
                  ecma: 5,
                  parse: {
                    ecma: 2017,
                  },
                  compress: {
                    //ecma: 5,
                    drop_console: true,
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
              }) as unknown) as WebpackPluginInstance,
            ],

            splitChunks: {
              cacheGroups: {
                // extract single css file
                style: {
                  test: (m: object) => m.constructor.name === 'CssModule',
                  name: `${file}.style`,
                  chunks: 'all',
                  enforce: true,
                },
              },
            },
          },
        }),
      );
    }
  }

  await fs.mkdirp(outDir);
  await Promise.all(
    staticFileDirectories.map((dir) =>
      fs.copy(dir, outDir, { dereference: true }),
    ),
  );

  const compiler: MultiCompiler = webpack(webpackConfigs);
  // FIXME webpack-bundle-analyzer related monkey patch https://github.com/webpack-contrib/webpack-bundle-analyzer/pull/384
  compiler.compilers.forEach(
    (compiler) => (compiler.outputFileSystem.constructor = () => {}),
  );

  await new Promise<void>((resolve, reject) => {
    compiler.run((error?: Error, stats?) => {
      if (error) {
        reject(error);
      } else if (stats) {
        console.log(
          stats.toString(
            typeof webpackConfigs[0].stats === 'object'
              ? {
                  colors: true,
                }
              : webpackConfigs[0].stats ?? { colors: true },
          ),
        );

        if (openBundleSizeReport) {
          if (os.platform() === 'win32') {
            exec(`start ${path.join(outDir, 'size-report.html')}`);
          } else {
            exec(`open ${path.join(outDir, 'size-report.html')}`);
          }
        }

        resolve();
      } else {
        throw new Error(`No error and stats`);
      }
    });
  });
}
