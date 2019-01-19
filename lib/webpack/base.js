"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
module.exports = (webpackConfig) => ({ app, appDirectory, zeroconfigDirectory }) => {
    const modules = ['node_modules'];
    if (fs_1.default.existsSync(path_1.default.join(zeroconfigDirectory, 'node_modules'))) {
        modules.push(path_1.default.join(zeroconfigDirectory, 'node_modules'));
    }
    return Promise.resolve(webpack_merge_1.default({
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
        resolveLoader: {
            modules,
        },
        performance: {
            hints: 'warning',
            maxEntrypointSize: 30000000,
            maxAssetSize: 20000000,
        },
        stats: {
            modules: false,
            maxModules: 0,
            errors: true,
            warnings: true,
            children: false,
            moduleTrace: true,
            errorDetails: true,
        },
    }, webpackConfig));
};
//# sourceMappingURL=base.js.map