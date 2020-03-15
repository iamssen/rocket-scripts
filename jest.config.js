module.exports = {
  roots: [
    '<rootDir>/packages/react-zeroconfig',
    '<rootDir>/packages/babel-preset'
  ],
  transform: {
    '.(ts|tsx)': 'ts-jest'
  },
  testMatch: [
    "**/__test?(s)__/**/*.ts?(x)",
    "**/?(*.)(spec|test).ts?(x)"
  ],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  collectCoverageFrom: [
    'packages/**/src/*.ts'
  ],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.base.json'
    }
  }
}