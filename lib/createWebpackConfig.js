"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const webpack_merge_1 = __importDefault(require("webpack-merge"));
module.exports = function (config, webpackFunctions) {
    return Promise
        .all(webpackFunctions.map(f => f(config)))
        .then(webpackConfigs => webpack_merge_1.default(...webpackConfigs));
};
//# sourceMappingURL=createWebpackConfig.js.map