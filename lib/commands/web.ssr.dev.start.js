"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const runNodemon_1 = __importDefault(require("../utils/web/runNodemon"));
module.exports = function ({ appDirectory }) {
    runNodemon_1.default({
        filePath: path_1.default.join(appDirectory, 'dist-dev/ssr/index.js'),
    });
};
//# sourceMappingURL=web.ssr.dev.start.js.map