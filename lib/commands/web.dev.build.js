"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const getCurrentTime_1 = __importDefault(require("../utils/getCurrentTime"));
const removeDirectory_1 = __importDefault(require("../utils/removeDirectory"));
const copyStaticFileDirectories_1 = __importDefault(require("../utils/web/copyStaticFileDirectories"));
const createWebpackConfig_1 = __importDefault(require("../utils/webpack/createWebpackConfig"));
const run_1 = __importDefault(require("../utils/webpack/run"));
const app_1 = __importDefault(require("../webpack/app"));
const base_1 = __importDefault(require("../webpack/base"));
const build_web_1 = __importDefault(require("../webpack/build-web"));
const client_1 = __importDefault(require("../webpack/client"));
module.exports = function (config) {
    const outputPath = path_1.default.join(config.appDirectory, 'dist-dev/web');
    const extractCss = true;
    const isProduction = false;
    removeDirectory_1.default(outputPath)
        .then(() => {
        return copyStaticFileDirectories_1.default({
            staticFileDirectories: config.app.staticFileDirectories,
            outputPath,
        });
    })
        .then(() => {
        return createWebpackConfig_1.default(config, [
            base_1.default({
                mode: 'development',
                devtool: 'source-map',
                output: {
                    path: outputPath,
                },
            }),
            app_1.default({ extractCss }),
            client_1.default(),
            build_web_1.default({ isProduction }),
        ]);
    })
        .then((webpackConfig) => {
        return run_1.default(config, webpackConfig);
    })
        .then(() => {
        console.log(`[${getCurrentTime_1.default()}] 👍 App build is successful.`);
    })
        .catch((error) => {
        console.error(`[${getCurrentTime_1.default()}] 💀 App build is failed.`);
        console.error(error);
    });
};
//# sourceMappingURL=web.dev.build.js.map