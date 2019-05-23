"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const webpack_1 = __importDefault(require("webpack"));
function watchWebpack(webpackConfig, watchOptions = {}) {
    return new rxjs_1.Observable((observer) => {
        const watching = webpack_1.default(webpackConfig).watch(watchOptions, (error, stats) => {
            if (error) {
                observer.error(error);
            }
            else {
                observer.next(stats.toString(typeof webpackConfig.stats === 'object'
                    ? {
                        ...webpackConfig.stats,
                        colors: true,
                    }
                    : webpackConfig.stats));
            }
        });
        return () => {
            watching.close(() => {
                // end watch
            });
        };
    });
}
exports.watchWebpack = watchWebpack;
//# sourceMappingURL=watchWebpack.js.map