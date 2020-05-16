"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebpackAlias = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const getInternalPackageEntry_1 = require("../internalPackage/getInternalPackageEntry");
function getWebpackAlias({ cwd }) {
    const src = path_1.default.join(cwd, 'src');
    const alias = {};
    const packageDir = path_1.default.join(src, '_packages');
    fs_extra_1.default.readdirSync(src)
        .filter((dirname) => dirname[0] !== '_')
        .map((dirname) => path_1.default.join(src, dirname))
        .filter((dirpath) => fs_extra_1.default.statSync(dirpath).isDirectory())
        .forEach((dirpath) => (alias[path_1.default.basename(dirpath)] = path_1.default.resolve(cwd, dirpath)));
    if (fs_extra_1.default.existsSync(packageDir) && fs_extra_1.default.statSync(packageDir).isDirectory()) {
        getInternalPackageEntry_1.getInternalPackageEntry({ packageDir: path_1.default.join(src, '_packages') })
            .filter((packageName) => fs_extra_1.default.statSync(path_1.default.join(src, `_packages/${packageName}`)).isDirectory())
            .forEach((packageName) => (alias[packageName] = path_1.default.join(src, `_packages/${packageName}`)));
    }
    return alias;
}
exports.getWebpackAlias = getWebpackAlias;
//# sourceMappingURL=getWebpackAlias.js.map