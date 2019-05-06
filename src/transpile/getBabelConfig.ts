export function getBabelConfig({modules}: {modules: 'commonjs' | false}): object {
  return {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          targets: {
            ie: 9,
          },
          ignoreBrowserslistConfig: true,
          useBuiltIns: false,
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
      require.resolve('@babel/preset-typescript'),
    ],
    plugins: [
      require.resolve('@babel/plugin-transform-destructuring'),
      [
        require.resolve('@babel/plugin-proposal-decorators'),
        {
          legacy: false,
          decoratorsBeforeExport: true,
        },
      ],
      [
        require.resolve('@babel/plugin-proposal-class-properties'),
        {
          loose: true,
        },
      ],
      [
        require.resolve('@babel/plugin-proposal-object-rest-spread'),
        {
          useBuiltIns: true,
        },
      ],
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      require.resolve('@loadable/babel-plugin'),
      [
        require.resolve('babel-plugin-named-asset-import'),
        {
          loaderMap: {
            svg: {
              ReactComponent: '@svgr/webpack?-svgo![path]',
            },
          },
        },
      ],
      [
        require.resolve('babel-plugin-import'),
        {
          libraryName: 'antd',
        },
      ],
    ],
    overrides: [
      {
        test: /\.(ts|tsx)$/,
        plugins: [
          [
            require.resolve('@babel/plugin-proposal-decorators'),
            {
              legacy: true,
            },
          ],
        ],
      },
    ],
  };
}