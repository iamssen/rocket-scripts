const jestPreset = require('rocket-punch/jest-preset');

module.exports = {
  ...jestPreset,
  
  collectCoverageFrom: [
    ...jestPreset.collectCoverageFrom,
    '!src/@rocket-scripts/*/commands.ts',
    '!src/@rocket-scripts/cli/**',
  ],
};
