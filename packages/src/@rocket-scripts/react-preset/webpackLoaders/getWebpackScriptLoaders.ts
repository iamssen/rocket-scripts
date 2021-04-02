import type { TsConfigJson } from 'type-fest';
import { RuleSetCondition, RuleSetRule, RuleSetUse } from 'webpack';

interface WorkerUseParams {
  useWebWorker: true;
  chunkPath: string;
  publicPath: string;
}

interface WorkerUnuseParams {
  useWebWorker: false;
}

export interface ESBuildLoaderOptions {
  target:
    | 'es2016'
    | 'es2017'
    | 'es2018'
    | 'es2019'
    | 'es2020'
    | 'esnext'
    | `chrome${number}`
    | `firefox${number}`
    | `safari${number}`
    | `edge${number}`
    | `node${number}`;
  loader?: 'js' | 'jsx' | 'ts' | 'tsx';
  tsconfigRaw: TsConfigJson;
}

type Params = (WorkerUseParams | WorkerUnuseParams) & {
  include: RuleSetCondition;
  esbuildLoaderOptions: ESBuildLoaderOptions;
};

export function getWebpackScriptLoaders(params: Params): RuleSetRule[] {
  const { include } = params;

  const scriptRegex: RegExp = /\.(ts|tsx|js|mjs|jsx)$/;
  const workerRegex: RegExp = /\.worker.(ts|tsx|js|mjs|jsx)$/;

  const esbuildLoader: RuleSetUse = {
    loader: require.resolve('esbuild-loader'),
    options: {
      ...params.esbuildLoaderOptions,
      loader: 'tsx',
    } as ESBuildLoaderOptions,
  };

  if (params.useWebWorker) {
    const { chunkPath, publicPath } = params;

    return [
      {
        test: workerRegex,
        include,
        use: [
          {
            loader: require.resolve('worker-loader'),
            options: {
              filename: `${chunkPath}[fullhash].worker.js`,
              publicPath,
            },
          },
          esbuildLoader,
        ],
      },
      {
        test: scriptRegex,
        include,
        use: esbuildLoader,
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
    ];
  } else {
    return [
      {
        test: scriptRegex,
        include,
        use: esbuildLoader,
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
    ];
  }
}
