"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getWebpackRawLoaders() {
    return [
        {
            test: /\.(html|ejs|txt|md)$/,
            use: [
                require.resolve('raw-loader'),
            ],
        },
        {
            test: /\.(yaml|yml)$/,
            use: [
                require.resolve('json-loader'),
                require.resolve('yaml-loader'),
            ],
        },
    ];
}
exports.getWebpackRawLoaders = getWebpackRawLoaders;
//# sourceMappingURL=getWebpackRawLoaders.js.map