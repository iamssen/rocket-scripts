import path from 'path';

export = {
  roots: ['<rootDir>/src'],
  transform: {
    '.(ts|tsx|js|jsx)$': require.resolve(path.join(__dirname, 'jestTransform/transform/script')),
    '.(svg)$': require.resolve(path.join(__dirname, 'jestTransform/transform/svg')),
    '.(html|ejs|txt|md)$': require.resolve(path.join(__dirname, 'jestTransform/transform/text')),
    '.(yaml|yml)$': require.resolve(path.join(__dirname, 'jestTransform/transform/yaml')),
  },
  moduleNameMapper: {
    '.(bmp|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': require.resolve(
      path.join(__dirname, 'jestTransform/mockup/file'),
    ),
    '.(css|less|sass|scss)$': require.resolve(path.join(__dirname, 'jestTransform/mockup/style')),
    '.(mdx)$': require.resolve(path.join(__dirname, 'jestTransform/mockup/react')),
  },
  setupFilesAfterEnv: [require.resolve(path.join(__dirname, 'jestTransform/setup/fetch'))],
  testMatch: ['**/__test?(s)__/**/*.ts?(x)', '**/?(*.)(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'yaml', 'yml', 'svg'],
  collectCoverageFrom: ['src/**/*.ts?(x)', '!**/*.d.ts?(x)', '!**/__*__/**', '!**/bin/**', '!**/public/**'],
  modulePaths: ['<rootDir>/src/'],
} as const;
