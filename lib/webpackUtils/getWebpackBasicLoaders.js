"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getBabelConfig_1 = require("../transpile/getBabelConfig");
function getWebpackBasicLoaders({ include }) {
    return [
        // babel
        {
            test: /\.(ts|tsx|js|jsx)$/,
            include,
            loader: require.resolve('babel-loader'),
            options: {
                babelrc: false,
                configFile: false,
                ...getBabelConfig_1.getBabelConfig({
                    modules: false,
                }),
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