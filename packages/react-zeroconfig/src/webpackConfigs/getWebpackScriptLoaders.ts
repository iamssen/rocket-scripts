import path from 'path';
import { RuleSetLoader, RuleSetRule } from 'webpack';
import { getBabelConfig } from '../transpile/getBabelConfig';

interface WorkerUseParams {
  cwd: string;
  useWebWorker: true;
  chunkPath: string;
  publicPath: string;
}

interface WorkerUnuseParams {
  cwd: string;
  useWebWorker: false;
}

type Params = (WorkerUseParams | WorkerUnuseParams) & {
  targets?: string | string[];
}

/** @return RuleSetRule[] for oneOf */
export function getWebpackScriptLoaders(params: Params): RuleSetRule[] {
  const {cwd, targets} = params;
  
  const scriptRegex: RegExp = /\.(ts|tsx|js|mjs|jsx)$/;
  const workerRegex: RegExp = /\.worker.(ts|tsx|js|mjs|jsx)$/;
  
  const src: string = path.join(cwd, 'src');
  const babelLoader: RuleSetLoader = {
    loader: require.resolve('babel-loader'),
    options: {
      babelrc: false,
      configFile: false,
      ...getBabelConfig({
        cwd,
        modules: false,
        targets,
      }),
    },
  };
  
  if (params.useWebWorker) {
    const {chunkPath, publicPath} = params;
    
    return [
      {
        test: workerRegex,
        include: src,
        use: [
          {
            loader: require.resolve('worker-loader'),
            options: {
              name: `${chunkPath}[hash].worker.js`,
              publicPath,
            },
          },
          babelLoader,
        ],
      },
      {
        test: scriptRegex,
        include: src,
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
        include: src,
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