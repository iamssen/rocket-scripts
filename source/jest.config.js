const jestPreset = require('rocket-punch/jest-preset');

module.exports = {
  //...jestPreset,
  //
  //roots: ['<rootDir>/src/'],
  //
  //testTimeout: 80000,
  //
  //moduleNameMapper: {
  //  ...jestPreset.moduleNameMapper,
  //  'entities\\/maps\\/([a-z]+).json': 'entities/lib/maps/$1.json',
  //},

  roots: ['<rootDir>/src'],
  transform: {
    '\\.(ts|tsx|js|jsx)$': require.resolve('ts-jest'),
    '\\.(svg)$': require.resolve('@ssen/jest-transform/transform/svg'),
    '\\.(html|ejs|txt|md)$': require.resolve('@ssen/jest-transform/transform/text'),
    '\\.(yaml|yml)$': require.resolve('@ssen/jest-transform/transform/yaml'),
  },
  moduleNameMapper: {
    '\\.(bmp|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': require.resolve(
      '@ssen/jest-transform/mockup/file',
    ),
    '\\.(css|less|sass|scss)$': require.resolve('@ssen/jest-transform/mockup/style'),
    'entities\\/maps\\/([a-z]+).json': 'entities/lib/maps/$1.json',
  },
  testTimeout: 80000,
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: [require.resolve('@ssen/jest-transform/setup/fetch')],
  testMatch: ['**/__test?(s)__/**/*.ts?(x)', '**/?(*.)(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'yaml', 'yml', 'svg'],
  //collectCoverageFrom: ['src/**/*.ts?(x)', '!**/*.d.ts?(x)', '!**/__*__/**', '!**/bin/**', '!**/public/**'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },

  // https://github.com/kulshekhar/ts-jest/issues/1500
  // https://github.com/rocket-hangar/rocket-scripts/runs/931795831?check_suite_focus=true#step:11:95
  transformIgnorePatterns: ['/node_modules/', 'webpack\\.config\\.js$'],

  //setupFilesAfterEnv: [...jestPreset.setupFilesAfterEnv, './jest.setup.js'],

  collectCoverageFrom: [
    ...jestPreset.collectCoverageFrom,
    '!src/@rocket-scripts/react-preset/jestTransform/**',
    '!src/**/.package.ts',
  ],

  //moduleDirectories: ['<rootDir>/src', '<rootDir>/node_modules', '<rootDir>/../node_modules'],
  modulePaths: ['<rootDir>/src'],
};
