import babelPreset from '@rocket-scripts/babel-preset';
import { createTransformer } from 'babel-jest/build';

export = createTransformer({
  ...babelPreset(null, { modules: 'commonjs', targets: 'current node' }),
});
