"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebpackDataURILoaders = void 0;
function getWebpackDataURILoaders({ chunkPath }) {
    return [
        {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
                limit: 10000,
                name: `${chunkPath}[name].[hash].[ext]`,
            },
        },
    ];
}
exports.getWebpackDataURILoaders = getWebpackDataURILoaders;
//# sourceMappingURL=getWebpackDataURILoaders.js.map