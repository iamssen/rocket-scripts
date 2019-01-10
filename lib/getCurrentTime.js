"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const moment_1 = __importDefault(require("moment"));
const chalk_1 = __importDefault(require("chalk"));
module.exports = function () {
    return chalk_1.default.yellow.bold(moment_1.default().format('HH:mm:ss'));
};
//# sourceMappingURL=getCurrentTime.js.map