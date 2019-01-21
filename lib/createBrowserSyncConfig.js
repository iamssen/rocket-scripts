"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const compression_1 = __importDefault(require("compression"));
const http_proxy_middleware_1 = __importDefault(require("http-proxy-middleware"));
const webpack_1 = __importDefault(require("webpack"));
const webpack_dev_middleware_1 = __importDefault(require("webpack-dev-middleware"));
const webpack_hot_middleware_1 = __importDefault(require("webpack-hot-middleware"));
const path_1 = __importDefault(require("path"));
module.exports = function ({ app, appDirectory, ssrEnabled, middlewares = [] }, webpackConfig) {
    const compiler = webpack_1.default(webpackConfig);
    const middleware = [
        webpack_dev_middleware_1.default(compiler, {
            publicPath: app.publicPath,
            stats: { colors: true },
        }),
        webpack_hot_middleware_1.default(compiler),
        compression_1.default(),
        ...middlewares,
    ];
    if (ssrEnabled) {
        middleware.push(http_proxy_middleware_1.default(['**', '!**/*.*'], {
            target: `http://localhost:${app.ssrPort}`,
        }));
    }
    else {
        middleware.push(function (req, res, next) {
            if (req.url && !/\.[a-zA-Z0-9]+$/.test(req.url)) {
                req.url = '/index.html';
            }
            return next();
        });
    }
    return Promise.resolve({
        port: app.port,
        open: false,
        ghostMode: false,
        https: app.https,
        server: {
            baseDir: app.staticFileDirectories.map(dir => {
                return path_1.default.join(appDirectory, dir);
            }),
            middleware,
        },
        files: app.staticFileDirectories.map(dir => {
            return path_1.default.join(appDirectory, dir);
        }),
    });
};
//# sourceMappingURL=createBrowserSyncConfig.js.map