const jestPreset = require('rocket-punch/jest-preset');

module.exports = {
  ...jestPreset,
  
  testTimeout: 70000,

  // https://github.com/kulshekhar/ts-jest/issues/1500
  // https://github.com/rocket-hangar/rocket-scripts/runs/931795831?check_suite_focus=true#step:11:95
  transformIgnorePatterns: ['/node_modules/', 'webpack\\.config\\.js$'],

  //setupFilesAfterEnv: [...jestPreset.setupFilesAfterEnv, './jest.setup.js'],

  collectCoverageFrom: [
    ...jestPreset.collectCoverageFrom,
    '!src/@rocket-scripts/react-preset/jestTransform/**',
    '!src/**/.package.ts',
  ],
};
