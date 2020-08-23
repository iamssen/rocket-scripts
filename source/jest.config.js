const jestPreset = require('rocket-punch/jest-preset');

module.exports = {
  ...jestPreset,

  setupFiles: ['<rootDir>/jest.setup.js'],

  testTimeout: 80000,

  moduleNameMapper: {
    ...jestPreset.moduleNameMapper,
    // FIXME solve error that html-webpack-plugin uses entities@1.x and entities@2.x both
    'entities\\/maps\\/([a-z]+).json': 'entities/lib/maps/$1.json',
  },

  // https://github.com/kulshekhar/ts-jest/issues/1500
  // https://github.com/rocket-hangar/rocket-scripts/runs/931795831?check_suite_focus=true#step:11:95
  transformIgnorePatterns: ['/node_modules/', 'webpack\\.config\\.js$'],

  collectCoverageFrom: [
    ...jestPreset.collectCoverageFrom,
    '!src/@rocket-scripts/react-preset/jestTransform/**',
  ],
};
