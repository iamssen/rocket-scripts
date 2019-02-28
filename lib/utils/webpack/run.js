"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const webpack_1 = __importDefault(require("webpack"));
module.exports = function (config, webpackConfig) {
    return new Promise((resolve, reject) => {
        webpack_1.default(webpackConfig).run((error, stats) => {
            if (error) {
                reject(error);
            }
            else {
                console.log(stats.toString(typeof webpackConfig.stats === 'object'
                    ? {
                        ...webpackConfig.stats,
                        colors: true,
                    }
                    : webpackConfig.stats));
                resolve();
            }
        });
    });
};
//# sourceMappingURL=run.js.map