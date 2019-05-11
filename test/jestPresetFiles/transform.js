const {createTransformer} = require('babel-jest');
const {getBabelConfig} = require('../../lib/transpile/getBabelConfig');

module.exports = createTransformer({
  ...getBabelConfig({modules: 'commonjs'}),
});