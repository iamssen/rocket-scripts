import { Configuration } from 'webpack';
import { getWebpackAlias } from './webpackConfigs/getWebpackAlias';
import { getWebpackMDXLoaders } from './webpackConfigs/getWebpackMDXLoaders';
import { getWebpackScriptLoaders } from './webpackConfigs/getWebpackScriptLoaders';
import { getWebpackStyleLoaders } from './webpackConfigs/getWebpackStyleLoaders';
import { getWebpackYamlLoaders } from './webpackConfigs/getWebpackYamlLoaders';

const extractCss: boolean = false;

export function patchStorybookWebpackConfig({cwd = process.cwd(), config}: {cwd?: string, config: Configuration}) {
  process.env.BROWSERSLIST_ENV = 'development';
  
  config.resolve!.extensions!.push('.ts', '.tsx');
  
  config.resolve!.alias = {
    ...getWebpackAlias({cwd}),
    ...(config.resolve!.alias || {}),
  };
  
  // https://storybook.js.org/docs/configurations/default-config/
  // https://github.com/storybooks/storybook/blob/next/lib/core/src/server/preview/base-webpack.config.js
  config.module!.rules.push(
    {
      oneOf: [
        // ts, tsx, js, jsx - script
        ...getWebpackScriptLoaders({
          cwd,
          useWebWorker: false,
        }),
        
        // mdx - script
        //...(() => {
        //  const {dependencies, devDependencies}: PackageJson = fs.readJsonSync(path.join(cwd, 'package.json'));
        //
        //  if (((dependencies && dependencies['@storybook/addon-docs']) || (devDependencies && devDependencies['@storybook/addon-docs']))) {
        //    return getWebpackMDXLoaders({
        //      test: /\.(stories|story)\.mdx$/,
        //      cwd,
        //      mdxLoaderOptions: {
        //        compilers: [
        //          require('@storybook/addon-docs/mdx-compiler-plugin')({}),
        //        ],
        //      },
        //    });
        //  }
        //
        //  return [];
        //})(),
        ...getWebpackMDXLoaders({
          cwd,
        }),
        
        // html, ejs, txt, md - plain text
        //...getWebpackRawLoaders(),
  
        // yaml, yml
        ...getWebpackYamlLoaders(),
        
        // css, scss, sass, less - style
        // module.* - css module
        ...getWebpackStyleLoaders({
          cssRegex: /\.css$/,
          cssModuleRegex: /\.module.css$/,
          extractCss,
        }),
        
        ...getWebpackStyleLoaders({
          cssRegex: /\.(scss|sass)$/,
          cssModuleRegex: /\.module.(scss|sass)$/,
          extractCss,
          preProcessor: 'sass-loader',
        }),
        
        ...getWebpackStyleLoaders({
          cssRegex: /\.less$/,
          cssModuleRegex: /\.module.less$/,
          extractCss,
          preProcessor: 'less-loader',
        }),
      ],
    },
  );
  
  return config;
}