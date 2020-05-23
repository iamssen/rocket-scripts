"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebpackSVGLoaders = void 0;
function getWebpackSVGLoaders({ test = /\.svg$/, include, babelLoaderOptions, reactSvgLoaderOptions = { jsx: true }, }) {
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
                    loader: require.resolve('react-svg-loader'),
                    options: reactSvgLoaderOptions,
                },
            ],
        },
    ];
}
exports.getWebpackSVGLoaders = getWebpackSVGLoaders;
//# sourceMappingURL=getWebpackSVGLoaders.js.map