"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const getCurrentTime_1 = __importDefault(require("../utils/getCurrentTime"));
const build_1 = __importDefault(require("../utils/template/build"));
module.exports = function ({ appDirectory }) {
    build_1.default({
        templateDirectory: path_1.default.join(appDirectory, 'src/_templates'),
        outputPath: path_1.default.join(appDirectory, 'public'),
    }).then(() => {
        console.log(`[${getCurrentTime_1.default()}] 👍 Template build is successful.`);
    })
        .catch((error) => {
        console.error(`[${getCurrentTime_1.default()}] 💀 Template build is failed.`);
        console.error(error);
    });
};
//# sourceMappingURL=template.build.js.map