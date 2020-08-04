import { RuleSetCondition, RuleSetLoader, RuleSetRule } from 'webpack';

interface WorkerUseParams {
  useWebWorker: true;
  chunkPath: string;
  publicPath: string;
}

interface WorkerUnuseParams {
  useWebWorker: false;
}

type Params = (WorkerUseParams | WorkerUnuseParams) & {
  include: RuleSetCondition;
  babelLoaderOptions: object;
};

export function getWebpackScriptLoaders(params: Params): RuleSetRule[] {
  const { include } = params;

  const scriptRegex: RegExp = /\.(ts|tsx|js|mjs|jsx)$/;
  const workerRegex: RegExp = /\.worker.(ts|tsx|js|mjs|jsx)$/;

  const babelLoader: RuleSetLoader = {
    loader: require.resolve('babel-loader'),
    options: params.babelLoaderOptions,
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
              filename: `${chunkPath}[hash].worker.js`,
              publicPath,
            },
          },
          babelLoader,
        ],
      },
      {
        test: scriptRegex,
        include,
        use: babelLoader,
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
        use: babelLoader,
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
    ];
  }
}
