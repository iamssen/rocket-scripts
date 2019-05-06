import { Configuration } from 'webpack';

export function createBrowserAppWebpackConfig({chunkPath, vendorFileName, styleFileName, hash}: {chunkPath: string, vendorFileName: string, styleFileName: string, hash: string}): Configuration {
  return {
    output: {
      filename: `${chunkPath}[name]${hash}.js`,
      chunkFilename: `${chunkPath}[name]${hash}.js`,
    },
    
    optimization: {
      splitChunks: {
        cacheGroups: {
          // vendor chunk
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: vendorFileName,
            chunks: 'all',
          },
          
          // extract single css file
          style: {
            test: m => m.constructor.name === 'CssModule',
            name: styleFileName,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
  };
}