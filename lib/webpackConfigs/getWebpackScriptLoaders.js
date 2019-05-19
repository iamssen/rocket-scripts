"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const getBabelConfig_1 = require("../transpile/getBabelConfig");
function getWebpackScriptLoaders({ cwd, useWebWorker }) {
    const scriptRegex = /\.(ts|tsx|js|mjs|jsx)$/;
    const workerRegex = /\.worker.(ts|tsx|js|mjs|jsx)$/;
    const src = path_1.default.join(cwd, 'src');
    return useWebWorker
        ? [
            {
                test: scriptRegex,
                include: {
                    include: src,
                    not: [workerRegex],
                },
                loader: require.resolve('babel-loader'),
                options: {
                    babelrc: false,
                    configFile: false,
                    ...getBabelConfig_1.getBabelConfig({
                        cwd,
                        modules: false,
                    }),
                },
            },
            {
                test: workerRegex,
                include: src,
                use: [
                    {
                        loader: require.resolve('worker-loader'),
                    },
                    {
                        loader: require.resolve('babel-loader'),
                        options: {
                            babelrc: false,
                            configFile: false,
                            ...getBabelConfig_1.getBabelConfig({
                                cwd,
                                modules: false,
                            }),
                        },
                    },
                ],
            },
        ]
        : [
            {
                test: scriptRegex,
                include: src,
                loader: require.resolve('babel-loader'),
                options: {
                    babelrc: false,
                    configFile: false,
                    ...getBabelConfig_1.getBabelConfig({
                        cwd,
                        modules: false,
                    }),
                },
            },
        ];
}
exports.getWebpackScriptLoaders = getWebpackScriptLoaders;
//# sourceMappingURL=getWebpackScriptLoaders.js.map