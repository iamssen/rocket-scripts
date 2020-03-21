module.exports = {
  extends: ['@lunit/eslint-config/without-react', 'prettier', 'prettier/@typescript-eslint'],
  ignorePatterns: ['packages/**/public/*', 'packages/**/*.d.ts'],
};
