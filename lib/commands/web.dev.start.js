"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const createBrowserSyncConfig_1 = __importDefault(require("../createBrowserSyncConfig"));
const createWebpackConfig_1 = __importDefault(require("../createWebpackConfig"));
const getCurrentTime_1 = __importDefault(require("../getCurrentTime"));
const runBrowserSync_1 = __importDefault(require("../runBrowserSync"));
const app_1 = __importDefault(require("../webpack/app"));
const base_1 = __importDefault(require("../webpack/base"));
const client_1 = __importDefault(require("../webpack/client"));
const start_web_1 = __importDefault(require("../webpack/start-web"));
module.exports = function (config) {
    const extractCss = false;
    createWebpackConfig_1.default(config, [
        base_1.default({
            mode: 'development',
            devtool: 'cheap-module-eval-source-map',
            output: {
                path: config.appDirectory,
            },
        }),
        app_1.default({ extractCss }),
        client_1.default(),
        start_web_1.default(),
    ]).then(webpackConfig => {
        return createBrowserSyncConfig_1.default(config, webpackConfig);
    })
        .then(browserSyncConfig => {
        runBrowserSync_1.default(browserSyncConfig).subscribe(() => {
            console.log(`[${getCurrentTime_1.default()}] 👍 App build is successful.`);
        }, error => {
            console.error(`[${getCurrentTime_1.default()}] 💀 App build is failed.`);
            console.error(error);
        });
    })
        .catch(error => {
        console.error(`[${getCurrentTime_1.default()}] 💀 App build is failed.`);
        console.error(error);
    });
};
//# sourceMappingURL=web.dev.start.js.map