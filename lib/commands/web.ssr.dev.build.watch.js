"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const copyPackageJsonToSSR_1 = __importDefault(require("../copyPackageJsonToSSR"));
const createWebpackConfig_1 = __importDefault(require("../createWebpackConfig"));
const getCurrentTime_1 = __importDefault(require("../getCurrentTime"));
const removeDirectory_1 = __importDefault(require("../removeDirectory"));
const watchWebpack_1 = __importDefault(require("../watchWebpack"));
const app_1 = __importDefault(require("../webpack/app"));
const base_1 = __importDefault(require("../webpack/base"));
const build_ssr_1 = __importDefault(require("../webpack/build-ssr"));
const ssr_1 = __importDefault(require("../webpack/ssr"));
module.exports = function (config) {
    const outputPath = path_1.default.join(config.appDirectory, 'dist-dev/ssr');
    const extractCss = true;
    const isProduction = false;
    removeDirectory_1.default(outputPath)
        .then(() => {
        return createWebpackConfig_1.default(config, [
            base_1.default({
                mode: 'development',
                output: {
                    path: outputPath,
                },
            }),
            app_1.default({ extractCss }),
            ssr_1.default(),
            build_ssr_1.default({ isProduction }),
        ]);
    })
        .then(webpackConfig => {
        watchWebpack_1.default(config, webpackConfig).subscribe(() => {
            copyPackageJsonToSSR_1.default({
                appDirectory: config.appDirectory,
                outputPath: path_1.default.join(outputPath, 'package.json'),
            }).then(() => {
                console.log(`[${getCurrentTime_1.default()}] 👍 App build is successful.`);
            }).catch(error => {
                console.error(`[${getCurrentTime_1.default()}] 💀 App build is failed.`);
                console.error(error);
            });
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
//# sourceMappingURL=web.ssr.dev.build.watch.js.map