"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const getBabelConfig_1 = __importDefault(require("../babel/getBabelConfig"));
module.exports = function (include) {
    return [
        // babel
        {
            test: /\.(ts|tsx|js|jsx)$/,
            include,
            loader: require.resolve('babel-loader'),
            options: {
                babelrc: false,
                configFile: false,
                ...getBabelConfig_1.default({
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
};
//# sourceMappingURL=getDefaultLoaders.js.map