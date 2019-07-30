import { Configuration } from 'webpack';
import { getWebpackMDXLoaders } from './getWebpackMDXLoaders';
import { getWebpackRawLoaders } from './getWebpackRawLoaders';
import { getWebpackScriptLoaders } from './getWebpackScriptLoaders';
import { getWebpackStyleLoaders } from './getWebpackStyleLoaders';

export function createWebpackPackageConfig({cwd}: {cwd: string}): Configuration {
  const extractCss: boolean = true;
  
  return {
    module: {
      strictExportPresence: true,
      
      rules: [
        {
          oneOf: [
            // ts, tsx, js, jsx - script
            ...getWebpackScriptLoaders({
              cwd,
              useWebWorker: false,
            }),
            
            // mdx - script
            ...getWebpackMDXLoaders({
              cwd,
            }),
            
            // html, ejs, txt, md - plain text
            ...getWebpackRawLoaders(),
            
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
            
            // every files import by data uri
            {
              loader: require.resolve('url-loader'),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.json$/],
              options: {
                name: `[name].[hash].[ext]`,
              },
            },
          ],
        },
      ],
    },
  };
}