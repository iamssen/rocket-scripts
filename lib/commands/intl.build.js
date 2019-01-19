"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const buildTranslation_1 = __importDefault(require("../buildTranslation"));
const getCurrentTime_1 = __importDefault(require("../getCurrentTime"));
module.exports = function ({ appDirectory }) {
    buildTranslation_1.default({
        appDirectory: appDirectory,
        outputPath: path_1.default.join(appDirectory, 'src/generated/locales.json'),
        type: 'intl',
    }).then(() => {
        console.log(`[${getCurrentTime_1.default()}] 👍 Translation build is successful.`);
    })
        .catch(error => {
        console.error(`[${getCurrentTime_1.default()}] 💀 Translation build is failed.`);
        console.error(error);
    });
};
//# sourceMappingURL=intl.build.js.map