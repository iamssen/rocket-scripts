"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
module.exports = (webpackConfig) => ({ app, appDirectory, ssenpackDirectory }) => {
    const modules = ['node_modules'];
    if (fs_1.default.existsSync(`${ssenpackDirectory}/node_modules`)) {
        modules.push(`${ssenpackDirectory}/node_modules`);
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
            maxEntrypointSize: 3000000,
            maxAssetSize: 2000000,
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