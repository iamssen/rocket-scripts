"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createBrowserAppWebpackConfig({ chunkPath, vendorFileName, styleFileName, hash }) {
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
exports.createBrowserAppWebpackConfig = createBrowserAppWebpackConfig;
//# sourceMappingURL=createBrowserAppWebpackConfig.js.map