"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getWebpackRawLoaders() {
    return [
        {
            test: /\.(html|ejs|txt|md)$/,
            use: [require.resolve('raw-loader')],
        },
    ];
}
exports.getWebpackRawLoaders = getWebpackRawLoaders;
//# sourceMappingURL=getWebpackRawLoaders.js.map