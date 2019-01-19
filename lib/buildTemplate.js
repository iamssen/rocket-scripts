"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ejs_1 = __importDefault(require("ejs"));
const fs_1 = __importDefault(require("fs"));
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
module.exports = function ({ templateDirectory, outputPath }) {
    return new Promise((resolve, reject) => {
        glob_1.default(`${templateDirectory}/*.ejs`, (error, filePaths) => {
            if (error) {
                reject(error);
                return;
            }
            for (const filePath of filePaths) {
                const fileName = path_1.default.basename(filePath, '.ejs');
                const template = fs_1.default.readFileSync(filePath, { encoding: 'utf8' });
                const html = ejs_1.default.render(template);
                fs_1.default.writeFileSync(path_1.default.join(outputPath, `${fileName}.html`), html, { encoding: 'utf8' });
            }
        });
    });
};
//# sourceMappingURL=buildTemplate.js.map