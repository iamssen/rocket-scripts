"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const distributeTranslation_1 = __importDefault(require("../distributeTranslation"));
const getCurrentTime_1 = __importDefault(require("../getCurrentTime"));
const fs_1 = __importDefault(require("fs"));
module.exports = function ({ appDirectory }) {
    const filePath = `${appDirectory}/src/generated/locales.json`;
    if (fs_1.default.existsSync(filePath)) {
        distributeTranslation_1.default({
            filePath,
            appDirectory,
        }).then(() => {
            console.log(`[${getCurrentTime_1.default()}] 👍 Translation distribute is successful.`);
        })
            .catch(error => {
            console.error(`[${getCurrentTime_1.default()}] 💀 Translation distribute is failed.`);
            console.error(error);
        });
    }
    else {
        console.error(`[${getCurrentTime_1.default()}] 💀 "${filePath}" does not exists.`);
    }
};
//# sourceMappingURL=translation.distribute.js.map