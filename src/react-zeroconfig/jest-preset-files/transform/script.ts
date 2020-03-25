import { createTransformer } from 'babel-jest/build/index';
import { getBabelConfig } from '../../transpile/getBabelConfig';

// @ts-ignore
export = createTransformer({
  ...getBabelConfig({ modules: 'commonjs', cwd: process.cwd() }),
});
