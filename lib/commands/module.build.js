"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const getCurrentTime_1 = __importDefault(require("../utils/getCurrentTime"));
const buildTypescriptDeclarations_1 = __importDefault(require("../utils/module/buildTypescriptDeclarations"));
const copyStaticFiles_1 = __importDefault(require("../utils/module/copyStaticFiles"));
const createBuildOptions_1 = __importDefault(require("../utils/module/createBuildOptions"));
const removeDirectory_1 = __importDefault(require("../utils/removeDirectory"));
const createWebpackConfig_1 = __importDefault(require("../utils/webpack/createWebpackConfig"));
const run_1 = __importDefault(require("../utils/webpack/run"));
const base_1 = __importDefault(require("../webpack/base"));
const build_module_1 = __importDefault(require("../webpack/build-module"));
module.exports = function (config) {
    const { appDirectory, modules, zeroconfigDirectory } = config;
    const outputPath = path_1.default.join(appDirectory, 'dist/modules');
    const extractCss = true;
    removeDirectory_1.default(outputPath)
        .then(() => {
        return createBuildOptions_1.default({
            appDirectory: appDirectory,
            modules: modules.entry,
        });
    })
        .then((buildOptions) => new Promise((resolve, reject) => {
        let i = -1;
        function func() {
            if (++i < buildOptions.length) {
                const buildOption = buildOptions[i];
                Promise.all([
                    buildTypescriptDeclarations_1.default({
                        appDirectory,
                        zeroconfigDirectory,
                        buildOption,
                    }),
                    copyStaticFiles_1.default({
                        appDirectory,
                        buildOption,
                    }),
                    createWebpackConfig_1.default(config, [
                        base_1.default({
                            mode: 'production',
                        }),
                        build_module_1.default({ extractCss, buildOption }),
                    ]).then((webpackConfig) => {
                        return run_1.default(config, webpackConfig);
                    }),
                ]).then(() => func())
                    .catch((error) => reject(error));
            }
            else {
                resolve();
            }
        }
        func();
    }))
        .then(() => {
        console.log(`[${getCurrentTime_1.default()}] 👍 Module build is successful.`);
    })
        .catch((error) => {
        console.error(`[${getCurrentTime_1.default()}] 💀 Module build is failed.`);
        console.error(error);
    });
};
//# sourceMappingURL=module.build.js.map