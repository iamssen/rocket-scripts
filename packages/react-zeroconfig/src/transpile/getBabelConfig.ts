import { PackageJson } from 'type-fest';
import { getBrowserslistQuery } from './getBrowserslistQuery';
import fs from 'fs-extra';
import path from 'path';
import { Modules } from '@react-zeroconfig/babel-preset';

export function getBabelConfig({modules, cwd, targets}: {cwd: string, modules: Modules, targets?: string | string[]}): object {
  if (!targets) targets = getBrowserslistQuery({cwd});
  
  if (!process.env.JEST_WORKER_ID) {
    console.log('');
    console.log('---------------------------------------------------------------------------------');
    console.log('= BABEL PRESET-ENV TARGETS (=BROWSERSLIST QUERY) : ', targets);
    console.log('---------------------------------------------------------------------------------');
  }
  
  return {
    presets: [
      [
        require.resolve('@react-zeroconfig/babel-preset'),
        {
          modules,
          targets,
        },
      ],
    ],
    plugins: [
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
      
      require.resolve('@handbook/babel-plugin'),
      
      // babel-plugin-styled-components
      //...(() => {
      //  const {dependencies}: PackageJson = fs.readJsonSync(path.join(cwd, 'package.json'));
      //  if (!dependencies) return [];
      //
      //  return dependencies['styled-components']
      //    ? [require.resolve('babel-plugin-styled-components')]
      //    : [];
      //})(),
      
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
              libraryDirectory: '',
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
              libraryDirectory: '',
              camel2DashComponentName: false,
            },
            'tree-shaking-mui-icons',
          ]);
        }
        
        return pluginImports;
      })(),
    ],
  };
}