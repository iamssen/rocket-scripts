"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const getCurrentTime_1 = __importDefault(require("../getCurrentTime"));
const createModulePublishOptions = require("../createModulePublishOptions");
const filterModulePublishOptions = require("../filterModulePublishOptions");
const publishModules = require("../publishModules");
module.exports = function (config) {
    const { appDirectory, modules } = config;
    createModulePublishOptions({
        appDirectory,
        modules: modules.entry,
        version: 'latest',
    })
        .then((publishOptions) => {
        return filterModulePublishOptions(publishOptions);
    })
        .then((publishOptions) => {
        return publishModules({
            publishOptions,
            appDirectory,
        });
    })
        .then(() => {
        console.log(`[${getCurrentTime_1.default()}] 👍 Module publish is successful.`);
    })
        .catch((error) => {
        console.error(`[${getCurrentTime_1.default()}] 💀 Module publish is failed.`);
        console.error(error);
    });
};
//# sourceMappingURL=module.publish.js.map