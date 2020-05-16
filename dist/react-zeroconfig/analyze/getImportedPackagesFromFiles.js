"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImportedPackagesFromFiles = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const getImportedPackagesFromSource_1 = require("./getImportedPackagesFromSource");
async function getImportedPackagesFromFiles(files) {
    const dependencies = new Set();
    for (const file of files) {
        const source = await fs_extra_1.default.readFile(file, { encoding: 'utf8' });
        getImportedPackagesFromSource_1.getImportedPackagesFromSource(source).forEach((packageName) => dependencies.add(packageName));
    }
    return dependencies;
}
exports.getImportedPackagesFromFiles = getImportedPackagesFromFiles;
//# sourceMappingURL=getImportedPackagesFromFiles.js.map