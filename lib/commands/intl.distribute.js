"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const distributeTranslation_1 = __importDefault(require("../distributeTranslation"));
const getCurrentTime_1 = __importDefault(require("../getCurrentTime"));
module.exports = function ({ appDirectory }) {
    const filePath = path_1.default.join(appDirectory, 'src/generated/locales.json');
    if (fs_1.default.existsSync(filePath)) {
        distributeTranslation_1.default({
            filePath,
            appDirectory,
            type: 'intl',
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
//# sourceMappingURL=intl.distribute.js.map