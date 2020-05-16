"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watingFiles = void 0;
const chalk_1 = __importDefault(require("chalk"));
const fs_extra_1 = __importDefault(require("fs-extra"));
async function watingFiles(files, timeout = 1000 * 60) {
    return new Promise((resolve, reject) => {
        const t = Date.now();
        function remain() {
            return `${Math.floor((Date.now() - t) / 1000)}`;
        }
        function start() {
            if (files.every((file) => fs_extra_1.default.existsSync(file))) {
                resolve();
            }
            else if (Date.now() - t > timeout) {
                reject(new Error(`Timeout wating... ${files.join(', ')}`));
            }
            else {
                console.log(chalk_1.default.gray(`${remain()} : wating files... ${files.join(', ')}`));
                setTimeout(start, 1000);
            }
        }
        start();
        //console.log(chalk.gray(`${remain()} : wating files... ${files.join(', ')}`));
        //setTimeout(start, 2000);
    });
}
exports.watingFiles = watingFiles;
//# sourceMappingURL=watingFiles.js.map