const jestPreset = require('rocket-punch/jest-preset');

module.exports = {
  ...jestPreset,

  setupFilesAfterEnv: [...jestPreset.setupFilesAfterEnv, './jest.setup.js'],

  collectCoverageFrom: [
    ...jestPreset.collectCoverageFrom,
    '!src/@rocket-scripts/react-preset/jestTransform/**',
    '!src/rocket-scripts/**',
    '!src/**/.package.ts',
  ],
};
