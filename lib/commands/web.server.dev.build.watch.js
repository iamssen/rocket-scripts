"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const getCurrentTime_1 = __importDefault(require("../utils/getCurrentTime"));
const removeDirectory_1 = __importDefault(require("../utils/removeDirectory"));
const copyPackageJsonToServer_1 = __importDefault(require("../utils/web/copyPackageJsonToServer"));
const createWebpackConfig_1 = __importDefault(require("../utils/webpack/createWebpackConfig"));
const watch_1 = __importDefault(require("../utils/webpack/watch"));
const app_1 = __importDefault(require("../webpack/app"));
const base_1 = __importDefault(require("../webpack/base"));
const build_server_1 = __importDefault(require("../webpack/build-server"));
const server_1 = __importDefault(require("../webpack/server"));
module.exports = function (config) {
    const outputPath = path_1.default.join(config.appDirectory, 'dist-dev/server');
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
            server_1.default(),
            build_server_1.default({ isProduction }),
        ]);
    })
        .then((webpackConfig) => {
        watch_1.default(config, webpackConfig).subscribe(() => {
            copyPackageJsonToServer_1.default({
                appDirectory: config.appDirectory,
                outputPath: path_1.default.join(outputPath, 'package.json'),
            }).then(() => {
                console.log(`[${getCurrentTime_1.default()}] 👍 App build is successful.`);
            }).catch((error) => {
                console.error(`[${getCurrentTime_1.default()}] 💀 App build is failed.`);
                console.error(error);
            });
        }, (error) => {
            console.error(`[${getCurrentTime_1.default()}] 💀 App build is failed.`);
            console.error(error);
        });
    })
        .catch((error) => {
        console.error(`[${getCurrentTime_1.default()}] 💀 App build is failed.`);
        console.error(error);
    });
};
//# sourceMappingURL=web.server.dev.build.watch.js.map