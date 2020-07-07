module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testMatch: ['**/__test?(s)__/**/*.ts?(x)', '**/?(*.)(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts?(x)',
    '!**/*.d.ts?(x)',
    '!**/__*__/**',
    '!src/@rocket-scripts/*/commands.ts',
    '!src/@rocket-scripts/cli/**',
  ],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  modulePaths: ['<rootDir>/src/'],
  //globalSetup: 'jest-environment-puppeteer/setup',
  //globalTeardown: 'jest-environment-puppeteer/teardown',
  //testEnvironment: 'jest-environment-puppeteer',
};
