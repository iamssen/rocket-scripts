"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const getCurrentTime_1 = __importDefault(require("../utils/getCurrentTime"));
const createPublishOptions_1 = __importDefault(require("../utils/module/createPublishOptions"));
const filterPublishOptions_1 = __importDefault(require("../utils/module/filterPublishOptions"));
const publish_1 = __importDefault(require("../utils/module/publish"));
module.exports = function (config) {
    const { appDirectory, modules } = config;
    createPublishOptions_1.default({
        appDirectory,
        modules: modules.entry,
        version: 'latest',
    })
        .then((publishOptions) => {
        return filterPublishOptions_1.default(publishOptions);
    })
        .then((publishOptions) => {
        return publish_1.default({
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