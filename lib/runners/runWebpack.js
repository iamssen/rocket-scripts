"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
function runWebpack(webpackConfig) {
    return new Promise((resolve, reject) => {
        webpack_1.default(webpackConfig).run((error, stats) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(stats.toString(typeof webpackConfig.stats === 'object'
                    ? {
                        ...webpackConfig.stats,
                        colors: true,
                    }
                    : webpackConfig.stats));
            }
        });
    });
}
exports.runWebpack = runWebpack;
//# sourceMappingURL=runWebpack.js.map