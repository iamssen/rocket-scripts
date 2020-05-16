"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInternalPackagePublicDrectories = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const getInternalPackageEntry_1 = require("./getInternalPackageEntry");
async function getInternalPackagePublicDrectories({ packageDir }) {
    return getInternalPackageEntry_1.getInternalPackageEntry({ packageDir })
        .map((packageName) => path_1.default.join(packageDir, packageName, 'public'))
        .filter((publicDirectory) => fs_extra_1.default.pathExistsSync(publicDirectory) && fs_extra_1.default.statSync(publicDirectory).isDirectory());
}
exports.getInternalPackagePublicDrectories = getInternalPackagePublicDrectories;
//# sourceMappingURL=getInternalPackagePublicDrectories.js.map