"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getWebpackBasicLoaders({ include, babelConfig }) {
    return [
        // babel
        {
            test: /\.(ts|tsx|js|jsx)$/,
            include,
            loader: require.resolve('babel-loader'),
            options: {
                babelrc: false,
                configFile: false,
                ...babelConfig,
            },
        },
        // import text
        {
            test: /\.(html|ejs|txt|md)$/,
            include,
            use: [
                require.resolve('raw-loader'),
            ],
        },
    ];
}
exports.getWebpackBasicLoaders = getWebpackBasicLoaders;
//# sourceMappingURL=getWebpackBasicLoaders.js.map