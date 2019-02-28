"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getDefaultModulesEntry_1 = require("./getDefaultModulesEntry");
function getDefaultModulePublics(appDirectory) {
    return getDefaultModulesEntry_1.getDefaultModulesEntry(appDirectory)
        .map((moduleName) => path_1.default.join(appDirectory, `src/_modules/${moduleName}/public`))
        .filter((publicPath) => fs_1.default.existsSync(publicPath) && fs_1.default.statSync(publicPath).isDirectory())
        .map((publicPath) => path_1.default.relative(appDirectory, publicPath).split(path_1.default.sep).join('/'));
}
exports.getDefaultModulePublics = getDefaultModulePublics;
//# sourceMappingURL=getDefaultModulePublics.js.map