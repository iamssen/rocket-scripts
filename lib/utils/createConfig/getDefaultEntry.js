"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getDefaultEntry(appDirectory) {
    const entryFilesOrDirectories = fs_1.default.readdirSync(path_1.default.join(appDirectory, 'src/_app'));
    const entry = [];
    for (const entryName of entryFilesOrDirectories) {
        if (fs_1.default.statSync(path_1.default.join(appDirectory, 'src/_app', entryName)).isDirectory()) {
            if (fs_1.default.existsSync(path_1.default.join(appDirectory, 'src/_app', entryName, 'index.js'))
                || fs_1.default.existsSync(path_1.default.join(appDirectory, 'src/_app', entryName, 'index.jsx'))
                || fs_1.default.existsSync(path_1.default.join(appDirectory, 'src/_app', entryName, 'index.ts'))
                || fs_1.default.existsSync(path_1.default.join(appDirectory, 'src/_app', entryName, 'index.tsx'))) {
                entry.push(entryName);
            }
        }
        else if (/\.(js|jsx|ts|tsx)$/.test(entryName)) {
            entry.push(path_1.default.basename(entryName, path_1.default.extname(entryName)));
        }
    }
    return entry;
}
exports.getDefaultEntry = getDefaultEntry;
//# sourceMappingURL=getDefaultEntry.js.map