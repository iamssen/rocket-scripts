"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const rxjs_1 = require("rxjs");
const webpack_1 = __importDefault(require("webpack"));
module.exports = function (config, webpackConfig, watchOptions = {}) {
    return rxjs_1.Observable.create((observer) => {
        webpack_1.default(webpackConfig).watch(watchOptions, (error, stats) => {
            if (error) {
                observer.error(error);
            }
            else {
                console.log(stats.toString(typeof webpackConfig.stats === 'object'
                    ? {
                        ...webpackConfig.stats,
                        colors: true,
                    }
                    : webpackConfig.stats));
                observer.next();
            }
        });
    });
};
//# sourceMappingURL=watch.js.map