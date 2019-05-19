import path from 'path';
import { RuleSetRule } from 'webpack';
import { getBabelConfig } from '../transpile/getBabelConfig';

export function getWebpackScriptLoaders({cwd, useWebWorker}: {cwd: string, useWebWorker: boolean}): RuleSetRule[] {
  const scriptRegex: RegExp = /\.(ts|tsx|js|mjs|jsx)$/;
  const workerRegex: RegExp = /\.worker.(ts|tsx|js|mjs|jsx)$/;
  const src: string = path.join(cwd, 'src');
  
  return useWebWorker
    ? [
      {
        test: scriptRegex,
        include: {
          include: src,
          not: [workerRegex],
        },
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: false,
          configFile: false,
          ...getBabelConfig({
            cwd,
            modules: false,
          }),
        },
      },
      {
        test: workerRegex,
        include: src,
        use: [
          {
            loader: require.resolve('worker-loader'),
          },
          {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              ...getBabelConfig({
                cwd,
                modules: false,
              }),
            },
          },
        ],
      },
    ]
    : [
      {
        test: scriptRegex,
        include: src,
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: false,
          configFile: false,
          ...getBabelConfig({
            cwd,
            modules: false,
          }),
        },
      },
    ];
}