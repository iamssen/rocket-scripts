"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const copyStaticFileDirectories_1 = __importDefault(require("../copyStaticFileDirectories"));
const createWebpackConfig_1 = __importDefault(require("../createWebpackConfig"));
const getCurrentTime_1 = __importDefault(require("../getCurrentTime"));
const removeDirectory_1 = __importDefault(require("../removeDirectory"));
const watchWebpack_1 = __importDefault(require("../watchWebpack"));
const app_1 = __importDefault(require("../webpack/app"));
const base_1 = __importDefault(require("../webpack/base"));
const build_web_1 = __importDefault(require("../webpack/build-web"));
const client_1 = __importDefault(require("../webpack/client"));
const style_1 = __importDefault(require("../webpack/style"));
module.exports = function (config) {
    const outputPath = `${config.appDirectory}/dist-dev/web`;
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
            app_1.default(),
            client_1.default(),
            style_1.default({ extractCss }),
            build_web_1.default({ isProduction }),
        ]);
    })
        .then(webpackConfig => {
        watchWebpack_1.default(config, webpackConfig).subscribe(() => {
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
//# sourceMappingURL=web.dev.build.watch.js.map