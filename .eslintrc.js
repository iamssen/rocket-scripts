module.exports = {
  extends: ['@ssen', 'prettier', 'prettier/react', 'prettier/@typescript-eslint'],
  ignorePatterns: ['src/**/public/**/*', 'src/**/*.d.ts', 'src/**/*.js'],
  //overrides: [
  //  {
  //    files: ['**/*.ts?(x)'],
  //    rules: {
  //      '@typescript-eslint/typedef': [
  //        'error',
  //        {
  //          arrayDestructuring: false,
  //          arrowParameter: false,
  //          objectDestructuring: false,
  //          parameter: true,
  //          propertyDeclaration: true,
  //          memberVariableDeclaration: true,
  //          variableDeclaration: true,
  //        },
  //      ],
  //    },
  //  },
  //],
};
