module.exports = {
  extends: ['@lunit/eslint-config/without-react', 'prettier', 'prettier/@typescript-eslint'],
  ignorePatterns: ['src/**/public/**/*', 'src/**/*.d.ts', 'src/**/*.js'],
  rules: {
    '@typescript-eslint/typedef': [
      'error',
      {
        arrayDestructuring: false,
        arrowParameter: false,
        objectDestructuring: false,
        parameter: true,
        propertyDeclaration: true,
        memberVariableDeclaration: true,
        variableDeclaration: true,
      },
    ],
  },
};
