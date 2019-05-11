const path = require('path');

module.exports = {
  transform: {
    '\\.[jt]sx?$': path.join(__dirname, 'test/jestPresetFiles/transform'),
  },
  moduleNameMapper: {
    '\\.(bmp|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|html|ejs|txt|md)$': path.join(__dirname, 'test/jestPresetFiles/mockup/file.js'),
    '\\.(css|less|scss|sass)$': path.join(__dirname, 'test/jestPresetFiles/mockup/style.js'),
  },
  testMatch: [
    '**/__tests?__/**/*.[jt]s?(x)',
    '**/?(*.)(spec|test).[jt]s?(x)',
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
  ],
  moduleDirectories: [
    '<rootDir>/node_modules',
    '<rootDir>/src/_packages',
    '<rootDir>/src',
  ],
};