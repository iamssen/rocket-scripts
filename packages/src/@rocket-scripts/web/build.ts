import webpackReactConfig from '@rocket-scripts/react-preset/webpackConfig';
import { ESBuildLoaderOptions } from '@rocket-scripts/react-preset/webpackLoaders/getWebpackScriptLoaders';
import { getWebpackAlias, icuFormat } from '@rocket-scripts/utils';
import { exec } from 'child_process';
import { ESBuildMinifyPlugin } from 'esbuild-loader';
import fs from 'fs-extra';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import os from 'os';
import path from 'path';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
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
import { getTsConfigIncludes } from './utils/getTsConfigIncludes';

export async function build({
  cwd = process.cwd(),
  app,
  staticFileDirectories: _staticFileDirectories = ['{cwd}/public'],
  outDir: _outDir = '{cwd}/out/{app}',

  isolatedScripts,

  openBundleSizeReport = false,

  tsconfig: _tsconfig = '{cwd}/tsconfig.json',

  webpackConfig: _webpackConfig,
  esbuildLoaderOptions: _esbuildLoaderOptions,

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

  const esbuildLoaderOptions: ESBuildLoaderOptions = {
    target: 'es2016',
    loader: 'tsx',
    tsconfigRaw: {},
    ..._esbuildLoaderOptions,
  };

  const tsConfigIncludes: string[] = getTsConfigIncludes({
    cwd,
    entry,
    app,
    isolatedScripts,
  });

  const baseWebpackConfig: WebpackConfiguration = webpackMerge([
    userWebpackConfig,
    webpackReactConfig({
      chunkPath,
      publicPath,
      cwd,
      tsconfig,
      esbuildLoaderOptions,
      extractCss: true,
      tsConfigIncludes,
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
              new ESBuildMinifyPlugin({
                target: esbuildLoaderOptions.target,
                minify: true,
              }),
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
