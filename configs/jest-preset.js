const path = require('path');

const jestUtils = (file) => path.join(__dirname, '../lib/utils/jest', file);

module.exports = {
  transform: {
    '\\.[jt]sx?$': jestUtils('transform'),
  },
  moduleNameMapper: {
    '\\.(bmp|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|html|ejs|txt|md)$': jestUtils('fileMock.js'),
    '\\.(css|less|scss|sass)$': jestUtils('styleMock.js'),
  },
  testMatch: [
    '**/__tests?__/**/*.[jt]s?(x)',
    '**/?(*.)(spec|test).[jt]s?(x)',
  ],
  setupFiles: [
    jestUtils('polyfill.js'),
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
  ],
  moduleDirectories: [
    '<rootDir>/node_modules',
    '<rootDir>/src/_modules',
    '<rootDir>/src',
  ],
};