"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const glob_promise_1 = require("../utils/glob-promise");
async function getInternalPackageEntry({ cwd }) {
    const packages = path_1.default.join(cwd, 'src/_packages');
    if (!fs_extra_1.default.pathExistsSync(packages) || !fs_extra_1.default.statSync(packages).isDirectory())
        return [];
    const packageJsonPaths = await glob_promise_1.glob(`${packages}/**/package.json`);
    return packageJsonPaths
        .map((packageJsonPath) => path_1.default.dirname(packageJsonPath)) // remove package.json
        .map((dirname) => path_1.default.relative(packages, dirname).split(path_1.default.sep)) // remove /.../_packages/ and split with directory separator
        .map((dirnamePaths) => dirnamePaths.join('/'));
}
exports.getInternalPackageEntry = getInternalPackageEntry;
//# sourceMappingURL=getInternalPackageEntry.js.map