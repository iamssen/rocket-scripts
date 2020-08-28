export type Modules = 'amd' | 'umd' | 'systemjs' | 'commonjs' | 'cjs' | 'auto' | false;

export interface Options {
  modules: Modules;
  targets: string | string[];
}

// references
// https://github.com/facebook/create-react-app/blob/master/packages/babel-preset-react-app/create.js#L78

export default function (api: unknown, { modules, targets }: Options) {
  return {
    presets: [
      [
        // https://babeljs.io/docs/en/babel-preset-env
        require.resolve('@babel/preset-env'),
        {
          // read browserslist config manually by getBrowserslistQuery
          targets,
          ignoreBrowserslistConfig: true,
          // TODO improved polyfill builtin?
          useBuiltIns: false,
          // https://babeljs.io/docs/en/babel-preset-env#modules
          // webpack - modules: false
          // jest - modules: 'commonjs'
          modules,
          exclude: ['transform-typeof-symbol'],
        },
      ],
      [
        require.resolve('@babel/preset-react'),
        {
          useBuiltIns: true,
        },
      ],
      [require.resolve('@babel/preset-typescript')],
    ],
    plugins: [
      //require.resolve('@babel/plugin-transform-destructuring'),
      //[require.resolve('@babel/plugin-proposal-decorators'), false],
      [
        require.resolve('@babel/plugin-transform-arrow-functions'),
        {
          spec: false,
        },
      ],
      [
        require.resolve('@babel/plugin-proposal-class-properties'),
        {
          loose: true,
        },
      ],
      //[
      //  require.resolve('@babel/plugin-proposal-object-rest-spread'),
      //  {
      //    useBuiltIns: true,
      //  },
      //],
      //require.resolve('@babel/plugin-syntax-dynamic-import'),
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),

      [
        require.resolve('babel-plugin-named-asset-import'),
        {
          loaderMap: {
            svg: {
              ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]',
            },
          },
        },
      ],
    ],
    //overrides: [
    //  {
    //    test: /\.(ts|tsx)$/,
    //    plugins: [
    //      [
    //        require.resolve('@babel/plugin-proposal-decorators'),
    //        {
    //          legacy: true,
    //        },
    //      ],
    //    ],
    //  },
    //],
  };
}
