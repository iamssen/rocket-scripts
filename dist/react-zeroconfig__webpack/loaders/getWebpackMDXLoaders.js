"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebpackMDXLoaders = void 0;
function getWebpackMDXLoaders({ test = /\.mdx$/, include, babelLoaderOptions, mdxLoaderOptions = {}, }) {
    return [
        {
            test,
            include,
            use: [
                {
                    loader: require.resolve('babel-loader'),
                    options: babelLoaderOptions,
                },
                {
                    loader: require.resolve('@mdx-js/loader'),
                    options: mdxLoaderOptions,
                },
            ],
        },
    ];
}
exports.getWebpackMDXLoaders = getWebpackMDXLoaders;
//# sourceMappingURL=getWebpackMDXLoaders.js.map