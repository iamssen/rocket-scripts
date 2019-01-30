"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
module.exports = function ({ appDirectory }) {
    const src = path_1.default.join(appDirectory, 'src');
    const alias = {};
    const modules = path_1.default.join(src, '_modules');
    fs_1.default.readdirSync(src)
        .filter(dirname => dirname[0] !== '_')
        .map(dirname => path_1.default.join(src, dirname))
        .filter(dirpath => fs_1.default.statSync(dirpath).isDirectory())
        .forEach(dirpath => {
        alias[path_1.default.basename(dirpath)] = path_1.default.resolve(appDirectory, dirpath);
    });
    if (fs_1.default.existsSync(modules) && fs_1.default.statSync(modules).isDirectory()) {
        fs_1.default.readdirSync(path_1.default.join(src, '_modules'))
            .map(dirname => path_1.default.join(src, `_modules/${dirname}`))
            .filter(dirpath => fs_1.default.statSync(dirpath).isDirectory())
            .forEach(dirpath => {
            alias[path_1.default.basename(dirpath)] = path_1.default.resolve(appDirectory, dirpath);
        });
    }
    return alias;
};
//# sourceMappingURL=getAlias.js.map