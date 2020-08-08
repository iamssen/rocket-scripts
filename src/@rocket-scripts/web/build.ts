import { getBrowserslistQuery } from '@rocket-scripts/browserslist';
import { webpackConfig as webpackReactConfig } from '@rocket-scripts/react-preset';
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
  Options as WebpackOptions,
  Stats,
} from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge as webpackMerge } from 'webpack-merge';
import { getAppEntry } from './utils/getAppEntry';

export interface BuildParams {
  // cli
  app: string;
  outDir?: string;
  tsconfig?: string;
  staticFileDirectories?: string[];
  webpackConfig?: string | WebpackConfiguration;

  // api
  cwd: string;
  devtool?: WebpackOptions.Devtool;
  env?: NodeJS.ProcessEnv;
}

export async function build({
  cwd,
  app,
  devtool = 'source-map',
  outDir: _outDir = '{cwd}/out/{app}',
  staticFileDirectories: _staticFileDirectories = ['{cwd}/public'],
  env = {},
  tsconfig: _tsconfig = '{cwd}/tsconfig.json',
  webpackConfig: _webpackConfig,
}: BuildParams) {
  const outDir: string = icuFormat(_outDir, { cwd, app });
  const staticFileDirectories: string[] = _staticFileDirectories.map((dir) => icuFormat(dir, { cwd, app }));
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

  const webpackEnv = {
    ...filterReactEnv(env),
    PUBLIC_PATH: publicPath,
    PUBLIC_URL: publicPath,
    NODE_ENV: env['NODE_ENV'] || 'development',
  };

  const babelLoaderOptions: object = {
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

  const webpackConfig: WebpackConfiguration = webpackMerge(
    userWebpackConfig,
    webpackReactConfig({
      chunkPath,
      publicPath,
      cwd,
      tsconfig,
      babelLoaderOptions,
    }),
    {
      mode: 'production',
      devtool,

      output: {
        path: outDir,
        publicPath,
        filename: `${chunkPath}[name].[hash].js`,
        chunkFilename: `${chunkPath}[name].[hash].js`,
        pathinfo: false,
      },

      resolve: {
        symlinks: false,
        alias,
      },

      entry: entry.reduce((e, { name, index }) => {
        e[name] = path.join(cwd, 'src', app, index);
        return e;
      }, {}),

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
              preset: ['default', { minifyFontValues: { removeQuotes: false } }],
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
        // create css files
        new MiniCssExtractPlugin({
          filename: `${chunkPath}[name].[hash].css`,
          chunkFilename: `${chunkPath}[name].[hash].css`,
        }),

        // create size report
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: path.join(outDir, 'size-report.html'),
          openAnalyzer: false,
        }),

        //create html files
        ...entry.map(
          ({ html }) =>
            new HtmlWebpackPlugin({
              template: path.join(cwd, 'src', app, html),
              filename: html,
            }),
        ),

        new InterpolateHtmlPlugin(HtmlWebpackPlugin, webpackEnv),

        new DefinePlugin({
          'process.env': Object.keys(webpackEnv).reduce((stringifiedEnv, key) => {
            stringifiedEnv[key] = JSON.stringify(webpackEnv[key]);
            return stringifiedEnv;
          }, {}),
        }),
      ],
    },
  );

  await fs.mkdirp(outDir);
  await Promise.all(staticFileDirectories.map((dir) => fs.copy(dir, outDir, { dereference: true })));

  const compiler: Compiler = webpack(webpackConfig);

  await new Promise((resolve, reject) => {
    compiler.run((error: Error, stats: Stats) => {
      if (error) {
        reject(error);
      } else {
        console.log(
          stats.toString(
            typeof webpackConfig.stats === 'object'
              ? {
                  colors: true,
                }
              : webpackConfig.stats ?? { colors: true },
          ),
        );
        resolve();
      }
    });
  });
}
