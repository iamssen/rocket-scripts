export = {
  roots: ['<rootDir>/src'],
  transform: {
    '.(ts|tsx|js|jsx)$': require.resolve('@rocket-scripts/jest-transform/script'),
    '.(svg)$': require.resolve('@rocket-scripts/jest-transform/transform/svg'),
    '.(html|ejs|txt|md)$': require.resolve('@rocket-scripts/jest-transform/transform/text'),
    '.(yaml|yml)$': require.resolve('@rocket-scripts/jest-transform/transform/yaml'),
  },
  moduleNameMapper: {
    '.(bmp|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': require.resolve(
      '@rocket-scripts/jest-transform/mockup/file',
    ),
    '.(css|less|sass|scss)$': require.resolve('@rocket-scripts/jest-transform/mockup/style'),
    '.(mdx)$': require.resolve('@rocket-scripts/jest-transform/mockup/react'),
  },
  setupFilesAfterEnv: [require.resolve('@rocket-scripts/jest-transform/setup/fetch')],
  testMatch: ['**/__test?(s)__/**/*.ts?(x)', '**/?(*.)(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'yaml', 'yml', 'svg'],
  collectCoverageFrom: ['src/**/*.ts?(x)', '!**/*.d.ts?(x)', '!**/__*__/**', '!**/bin/**', '!**/public/**'],
  modulePaths: ['<rootDir>/src/'],
} as const;
