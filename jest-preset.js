const path = require('path');

module.exports = {
  transform: {
    '\\.[jt]sx?$': path.join(__dirname, 'jest-preset-files/transform/script.js'),
    '\\.(yaml|yml)$': path.join(__dirname, 'jest-preset-files/transform/yaml.js'),
  },
  moduleNameMapper: {
    '\\.(bmp|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|html|ejs|txt|md)$': path.join(__dirname, 'jest-preset-files/mockup/file.js'),
    '\\.(css|less|scss|sass)$': path.join(__dirname, 'jest-preset-files/mockup/style.js'),
  },
  testMatch: [
    '**/__test?(s)__/**/*.[jt]s?(x)',
    '**/?(*.)(spec|test).[jt]s?(x)',
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'yaml',
    'yml'
  ],
  moduleDirectories: [
    '<rootDir>/node_modules',
    '<rootDir>/src/_packages',
    '<rootDir>/src',
  ],
};