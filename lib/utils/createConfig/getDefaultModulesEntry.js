"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const glob_1 = __importDefault(require("glob"));
function getDefaultModulesEntry(appDirectory) {
    if (!fs_1.default.existsSync(path_1.default.join(appDirectory, 'src/_modules')) || !fs_1.default.statSync(path_1.default.join(appDirectory, 'src/_modules')).isDirectory()) {
        return [];
    }
    return glob_1.default
        .sync(`${appDirectory}/src/_modules/**/package.json`)
        .map((packageJsonPath) => path_1.default.dirname(packageJsonPath))
        .map((dirname) => path_1.default.relative(path_1.default.join(appDirectory, 'src/_modules'), dirname).split(path_1.default.sep))
        .map((dirnamePaths) => dirnamePaths.join('/'));
}
exports.getDefaultModulesEntry = getDefaultModulesEntry;
//# sourceMappingURL=getDefaultModulesEntry.js.map