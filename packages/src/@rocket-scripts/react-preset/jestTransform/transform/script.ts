import transformer, { Options } from 'esbuild-jest';

export = transformer.createTransformer?.({
  target: 'es2018',
  sourcemap: 'inline',
  loaders: {
    '.js': 'js',
    '.jsx': 'jsx',
    '.ts': 'ts',
    '.tsx': 'tsx',
  },
} as Options);
