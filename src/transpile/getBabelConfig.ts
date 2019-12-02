import { PackageJson } from 'type-fest';
import { getBrowserslistQuery } from './getBrowserslistQuery';
import fs from 'fs-extra';
import path from 'path';

type Modules = 'amd' | 'umd' | 'systemjs' | 'commonjs' | 'cjs' | 'auto' | false;

export function getBabelConfig({modules, cwd, targets}: {cwd: string, modules: Modules, targets?: string | string[]}): object {
  if (!targets) targets = getBrowserslistQuery({cwd});
  
  if (!process.env.JEST_WORKER_ID) {
    console.log('');
    console.log('---------------------------------------------------------------------------------');
    console.log('= BABEL PRESET-ENV TARGETS (=BROWSERSLIST QUERY) : ', targets);
    console.log('---------------------------------------------------------------------------------');
  }
  
  return {
    // https://github.com/facebook/create-react-app/blob/master/packages/babel-preset-react-app/create.js#L78
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
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
      require.resolve('@loadable/babel-plugin'),
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
      // babel-plugin-styled-components
      ...(() => {
        const {dependencies}: PackageJson = fs.readJsonSync(path.join(cwd, 'package.json'));
        if (!dependencies) return [];
        
        return dependencies['styled-components']
          ? [require.resolve('babel-plugin-styled-components')]
          : [];
      })(),
      // babel-plugin-import
      ...(() => {
        const {dependencies}: PackageJson = fs.readJsonSync(path.join(cwd, 'package.json'));
        if (!dependencies) return [];
        
        const pluginImports: [string, object, string][] = [];
        
        if (dependencies['antd']) {
          pluginImports.push([
            require.resolve('babel-plugin-import'),
            {
              libraryName: 'antd',
            },
            'tree-shaking-antd',
          ]);
        }
        
        if (dependencies['@material-ui/core']) {
          pluginImports.push([
            require.resolve('babel-plugin-import'),
            {
              libraryName: '@material-ui/core',
              libraryDirectory: 'esm',
              camel2DashComponentName: false,
            },
            'tree-shaking-mui-core',
          ]);
        }
        
        if (dependencies['@material-ui/icons']) {
          pluginImports.push([
            require.resolve('babel-plugin-import'),
            {
              libraryName: '@material-ui/icons',
              libraryDirectory: 'esm',
              camel2DashComponentName: false,
            },
            'tree-shaking-mui-icons',
          ]);
        }
        
        return pluginImports;
      })(),
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