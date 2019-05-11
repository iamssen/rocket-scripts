"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function copyServerPackageJson({ file, copyTo }) {
    const { dependencies } = await fs_extra_1.default.readJson(file);
    await fs_extra_1.default.mkdirp(path_1.default.dirname(copyTo));
    await fs_extra_1.default.writeJson(copyTo, { dependencies }, { encoding: 'utf8' });
}
exports.copyServerPackageJson = copyServerPackageJson;
//# sourceMappingURL=copyServerPackageJson.js.map