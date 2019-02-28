import { createTransformer } from 'babel-jest';
import getBabelConfig from '../babel/getBabelConfig';

export = createTransformer({
  ...getBabelConfig({
    modules: 'commonjs',
  }),
});