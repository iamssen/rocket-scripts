"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const path_1 = __importDefault(require("path"));
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
const getDefaultLoaders_1 = __importDefault(require("../getDefaultLoaders"));
module.exports = ({ buildOption }) => ({ appDirectory }) => {
    const libraryTarget = 'commonjs';
    return Promise.resolve({
        entry: () => buildOption.file,
        externals: [webpack_node_externals_1.default(), ...buildOption.externals],
        output: {
            path: path_1.default.join(appDirectory, `dist/modules/${buildOption.name}`),
            filename: 'index.js',
            libraryTarget,
        },
        optimization: {
            concatenateModules: true,
        },
        module: {
            rules: [
                {
                    oneOf: [
                        ...getDefaultLoaders_1.default(path_1.default.join(appDirectory, `src/_modules/${buildOption.name}`)),
                    ],
                },
            ],
        },
        plugins: [
            new mini_css_extract_plugin_1.default({
                filename: 'index.css',
            }),
        ],
    });
};
//# sourceMappingURL=build-module.js.map