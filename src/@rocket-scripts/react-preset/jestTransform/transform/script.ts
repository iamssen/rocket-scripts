import { createTransformer } from 'babel-jest/build';
import babelPreset from '../../babel-preset';

export = createTransformer({
  ...babelPreset(null, { modules: 'commonjs', targets: 'current node' }),
});
