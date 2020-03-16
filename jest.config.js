module.exports = {
  roots: [
    '<rootDir>/packages'
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
      tsConfig: 'tsconfig.json'
    }
  }
}