"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const runNodemon_1 = __importDefault(require("../runNodemon"));
module.exports = function ({ appDirectory }) {
    runNodemon_1.default({
        filePath: `${appDirectory}/dist-dev/ssr/index.js`,
    });
};
//# sourceMappingURL=web.ssr.dev.start.js.map