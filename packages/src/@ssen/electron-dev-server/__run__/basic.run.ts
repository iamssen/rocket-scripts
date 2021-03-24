import { getBrowserslistQuery } from '@rocket-scripts/browserslist';
import mainWebpackConfig from '@rocket-scripts/react-electron-preset/mainWebpackConfig';
import rendererWebpackConfig from '@rocket-scripts/react-electron-preset/rendererWebpackConfig';
import { getWebpackAlias } from '@rocket-scripts/utils';
import { copyFixture } from '@ssen/copy-fixture';
import { exec } from '@ssen/promised';
import { createTmpDirectory } from '@ssen/tmp-directory';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import { DefinePlugin, WebpackPluginInstance } from 'webpack';
import { merge } from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import { devServerStart } from '../devServerStart';

(async () => {
  process.env.NODE_ENV = 'development';

  const cwd: string = await copyFixture('test/fixtures/electron/start');
  const outDir: string = await createTmpDirectory();
  const env: NodeJS.ProcessEnv = process.env;

  // await exec(`yarn --production`, { cwd });

  console.log('Start Server...');

  exec(`open ${cwd}`);
  exec(`open ${outDir}`);

  //const appDir: string = path.join(cwd, 'src/app');
  const tsconfig: string = path.join(cwd, 'tsconfig.json');
  const alias = getWebpackAlias(cwd);
  const publicPath: string = '';
  const chunkPath: string = '';

  const reactAppEnv: NodeJS.ProcessEnv = Object.keys(env)
    .filter((key) => /^REACT_APP_/i.test(key))
    .reduce((e, key) => {
      e[key] = env[key];
      return e;
    }, {} as NodeJS.ProcessEnv);

  const webpackEnv: NodeJS.ProcessEnv = {
    ...reactAppEnv,
    PUBLIC_PATH: publicPath,
    PUBLIC_URL: publicPath,
    NODE_ENV: process.env.NODE_ENV ?? 'development',
  };

  const babelLoaderOptions: object = {
    presets: [
      [
        require.resolve('@rocket-scripts/react-preset/babelPreset'),
        {
          modules: false,
          targets: getBrowserslistQuery({ cwd, env: 'electron' }),
        },
      ],
    ],
  };

  await devServerStart({
    cwd,
    outDir,
    staticFileDirectories: [path.join(cwd, 'public')],
    mainWebpackConfig: merge(
      mainWebpackConfig({
        tsconfig,
        babelLoaderOptions,
        cwd,
      }),
      {
        mode: 'development',
        devtool: 'source-map',

        externals: [
          nodeExternals({
            allowlist: [
              // include asset files
              /\.(?!(?:jsx?|json)$).{1,5}$/i,
            ],
          }),
        ],

        resolve: {
          symlinks: false,
          alias,
        },

        entry: {
          main: path.join(cwd, 'src/app/main'),
          preload: path.join(cwd, 'src/app/preload'),
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

        performance: {
          hints: false,
        },

        optimization: {
          removeAvailableModules: false,
          removeEmptyChunks: false,
          splitChunks: false,

          moduleIds: 'named',
          emitOnErrors: false,
        },
      },
    ),
    rendererWebpackConfig: merge(
      rendererWebpackConfig({
        publicPath,
        chunkPath,
        babelLoaderOptions,
        cwd,
        tsconfig,
        extractCss: false,
      }),
      {
        mode: 'development',
        devtool: 'source-map',

        entry: {
          renderer: path.join(cwd, 'src/app/renderer'),
        },

        plugins: [
          new MiniCssExtractPlugin({
            filename: `[name].css`,
          }),

          new HtmlWebpackPlugin({
            template: path.join(cwd, 'src/app/index.html'),
            filename: 'index.html',
          }),

          new InterpolateHtmlPlugin(
            HtmlWebpackPlugin,
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
          }),
        ],

        performance: {
          hints: false,
        },

        optimization: {
          removeAvailableModules: false,
          removeEmptyChunks: false,
          splitChunks: false,

          moduleIds: 'named',
          emitOnErrors: false,
        },
      },
    ),
  });
})();
