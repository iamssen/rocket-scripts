"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const buildModuleDeclarations_1 = __importDefault(require("../buildModuleDeclarations"));
const copyModuleStaticFiles_1 = __importDefault(require("../copyModuleStaticFiles"));
const createModuleBuildOptions_1 = __importDefault(require("../createModuleBuildOptions"));
const createWebpackConfig_1 = __importDefault(require("../createWebpackConfig"));
const getCurrentTime_1 = __importDefault(require("../getCurrentTime"));
const removeDirectory_1 = __importDefault(require("../removeDirectory"));
const base_1 = __importDefault(require("../webpack/base"));
const build_module_1 = __importDefault(require("../webpack/build-module"));
const runWebpack = require("../runWebpack");
module.exports = function (config) {
    const { appDirectory, modules } = config;
    const outputPath = path_1.default.join(appDirectory, 'dist/modules');
    const extractCss = true;
    removeDirectory_1.default(outputPath)
        .then(() => {
        return createModuleBuildOptions_1.default({
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
                    buildModuleDeclarations_1.default({
                        appDirectory,
                        buildOption,
                    }),
                    copyModuleStaticFiles_1.default({
                        appDirectory,
                        buildOption,
                    }),
                    createWebpackConfig_1.default(config, [
                        base_1.default({
                            mode: 'production',
                        }),
                        build_module_1.default({ extractCss, buildOption }),
                    ]).then((webpackConfig) => {
                        return runWebpack(config, webpackConfig);
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