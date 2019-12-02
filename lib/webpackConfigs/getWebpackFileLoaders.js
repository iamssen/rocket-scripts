"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getWebpackFileLoaders({ chunkPath }) {
    return [
        {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.json$/],
            options: {
                name: `${chunkPath}[name].[hash].[ext]`,
                esModule: false,
            },
        },
    ];
}
exports.getWebpackFileLoaders = getWebpackFileLoaders;
//# sourceMappingURL=getWebpackFileLoaders.js.map