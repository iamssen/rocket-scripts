"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const buildTranslation_1 = __importDefault(require("../buildTranslation"));
const getCurrentTime_1 = __importDefault(require("../getCurrentTime"));
module.exports = function ({ appDirectory }) {
    buildTranslation_1.default({
        appDirectory: appDirectory,
        outputPath: `${appDirectory}/src/generated/locales.json`,
    }).then(() => {
        console.log(`[${getCurrentTime_1.default()}] 👍 Translation build is successful.`);
    })
        .catch(error => {
        console.error(`[${getCurrentTime_1.default()}] 💀 Translation build is failed.`);
        console.error(error);
    });
};
//# sourceMappingURL=translation.build.js.map