"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
module.exports = () => (config) => {
    const { appDirectory } = config;
    const target = 'node';
    const libraryTarget = 'commonjs';
    return Promise.resolve({
        target,
        entry: {
            index: `${appDirectory}/src/_entry/ssr`,
        },
        output: {
            libraryTarget,
        },
        externals: [webpack_node_externals_1.default()],
    });
};
//# sourceMappingURL=ssr.js.map