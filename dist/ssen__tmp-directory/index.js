"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyTmpDirectory = exports.createTmpDirectory = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const tmp_1 = __importDefault(require("tmp"));
async function createTmpDirectory() {
    const { name } = tmp_1.default.dirSync();
    return fs_extra_1.default.realpathSync(name);
}
exports.createTmpDirectory = createTmpDirectory;
async function copyTmpDirectory(...paths) {
    const { name } = tmp_1.default.dirSync();
    await fs_extra_1.default.copy(path_1.default.join(...paths), name);
    return fs_extra_1.default.realpathSync(name);
}
exports.copyTmpDirectory = copyTmpDirectory;
//# sourceMappingURL=index.js.map