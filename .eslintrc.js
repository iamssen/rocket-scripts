module.exports = {
  extends: ['@ssen'],
  rules: {
    'import/no-anonymous-default-export': 0,
  },
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
