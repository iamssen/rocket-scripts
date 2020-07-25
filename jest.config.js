const jestPreset = require('rocket-punch/jest-preset');

module.exports = {
  ...jestPreset,

  setupFilesAfterEnv: [...jestPreset.setupFilesAfterEnv, './jest.setup.js'],

  collectCoverageFrom: [
    ...jestPreset.collectCoverageFrom,
    '!src/@rocket-scripts/*/commands.ts',
    '!src/@rocket-scripts/cli/**',
    '!src/@rocket-scripts/jest-transform/**',
  ],
};
