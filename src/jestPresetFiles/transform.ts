import { createTransformer } from 'babel-jest';
import { getBabelConfig } from '../transpile/getBabelConfig';

export = createTransformer({
  ...getBabelConfig({modules: 'commonjs'}),
});