import { createTransformer } from 'babel-jest/build';
import babelPreset from '../../babelPreset';

export = createTransformer({
  ...babelPreset(null, { modules: 'commonjs', targets: 'current node' }),
});
