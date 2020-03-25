module.exports = {
  roots: [
    '<rootDir>/src'
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
    'src/**/*.ts'
  ],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json'
    }
  }
}