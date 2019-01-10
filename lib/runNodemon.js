"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const nodemon_1 = __importDefault(require("nodemon"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
module.exports = function ({ filePath }) {
    const start = Date.now();
    function watingTime() {
        return `${Math.floor((Date.now() - start) / 1000)}`;
    }
    function test() {
        if (fs_1.default.existsSync(filePath)) {
            console.log(chalk_1.default.yellow.bold(`🚀 Start nodemon server!`));
            nodemon_1.default({
                watch: [
                    path_1.default.dirname(filePath),
                ],
                exec: `node -r ${path_1.default.dirname(require.resolve('source-map-support/package.json'))}/register ${filePath}`,
            });
        }
        else {
            console.log(chalk_1.default.gray(`🕝 Wating "${filePath}" file creation... ${watingTime()}`));
            setTimeout(test, 1000);
        }
    }
    console.log(chalk_1.default.gray(`🕝 Wating "${filePath}" file creation... ${watingTime()}`));
    setTimeout(test, 2000);
};
//# sourceMappingURL=runNodemon.js.map