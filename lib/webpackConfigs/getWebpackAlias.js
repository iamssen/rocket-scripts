"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function getWebpackAlias({ cwd }) {
    const src = path_1.default.join(cwd, 'src');
    const alias = {};
    const packageDir = path_1.default.join(src, '_packages');
    fs_extra_1.default.readdirSync(src)
        .filter((dirname) => dirname[0] !== '_')
        .map((dirname) => path_1.default.join(src, dirname))
        .filter((dirpath) => fs_extra_1.default.statSync(dirpath).isDirectory())
        .forEach((dirpath) => alias[path_1.default.basename(dirpath)] = path_1.default.resolve(cwd, dirpath));
    if (fs_extra_1.default.existsSync(packageDir) && fs_extra_1.default.statSync(packageDir).isDirectory()) {
        fs_extra_1.default.readdirSync(path_1.default.join(src, '_packages'))
            .map((dirname) => path_1.default.join(src, `_packages/${dirname}`))
            .filter((dirpath) => fs_extra_1.default.statSync(dirpath).isDirectory())
            .forEach((dirpath) => alias[path_1.default.basename(dirpath)] = path_1.default.resolve(cwd, dirpath));
    }
    return alias;
}
exports.getWebpackAlias = getWebpackAlias;
//# sourceMappingURL=getWebpackAlias.js.map