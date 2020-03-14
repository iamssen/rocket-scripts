const {createTransformer} = require('babel-jest/build/index');
const {getBabelConfig} = require('../../lib/transpile/getBabelConfig');

module.exports = createTransformer({
  ...getBabelConfig({modules: 'commonjs', cwd: process.cwd()}),
});