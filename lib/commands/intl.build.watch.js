"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const getCurrentTime_1 = __importDefault(require("../utils/getCurrentTime"));
const watch_1 = __importDefault(require("../utils/translation/watch"));
module.exports = function ({ appDirectory }) {
    watch_1.default({
        appDirectory: appDirectory,
        outputPath: path_1.default.join(appDirectory, 'src/generated/locales.json'),
        type: 'intl',
    }).subscribe(() => {
        console.log(`[${getCurrentTime_1.default()}] 👍 Translation build is successful.`);
    }, (error) => {
        console.error(`[${getCurrentTime_1.default()}] 💀 Translation build is failed.`);
        console.error(error);
    });
};
//# sourceMappingURL=intl.build.watch.js.map