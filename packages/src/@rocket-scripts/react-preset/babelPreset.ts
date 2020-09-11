export type Modules =
  | 'amd'
  | 'umd'
  | 'systemjs'
  | 'commonjs'
  | 'cjs'
  | 'auto'
  | false;

export interface Options {
  modules: Modules;
  targets: string | string[] | { [name: string]: string };
}

// @see https://github.com/facebook/create-react-app/blob/master/packages/babel-preset-react-app/create.js#L78

export default function (api: unknown, { modules, targets }: Options) {
  const isTest: boolean = process.env.NODE_ENV === 'test';
  const isProduction: boolean = process.env.NODE_ENV === 'production';

  if (!isTest) {
    console.log('='.repeat(20));
    console.log('BABEL LOADER TARGETS:', { modules, targets });
    console.log('='.repeat(20));
  }

  return {
    presets: [
      [
        // https://babeljs.io/docs/en/babel-preset-env
        require.resolve('@babel/preset-env'),
        {
          // read browserslist config manually by getBrowserslistQuery
          targets: isTest ? 'current node' : targets,
          ignoreBrowserslistConfig: true,
          // core-js built in
          useBuiltIns: isTest ? false : 'entry',
          corejs: 3,
          // https://babeljs.io/docs/en/babel-preset-env#modules
          // webpack = modules: false
          // jest    = modules: 'commonjs'
          modules,
          exclude: ['transform-typeof-symbol'],
        },
      ],
      [
        require.resolve('@babel/preset-react'),
        {
          development: !isProduction,
          useBuiltIns: true,
        },
      ],
      [
        require.resolve('@babel/preset-typescript'),
        {
          allowDeclareFields: true,
          allowNamespaces: true,
        },
      ],
    ],
    plugins: [
      // replace all arrow functions to binded functions
      // this is performance reason ( binded function is faster than arrow function)
      [
        require.resolve('@babel/plugin-transform-arrow-functions'),
        {
          spec: false,
        },
      ],
      // support class properties
      [
        require.resolve('@babel/plugin-proposal-class-properties'),
        {
          // using Object.defineProperty()
          // https://babel.dev/docs/en/babel-plugin-proposal-class-properties#loose
          loose: true,
        },
      ],
      // support TS39 `obj?.val` and `obj ?? next`
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
      // support import url, { ReactComponent } from './image.svg'
      // this is CRA rule
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
  };
}
