"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const tmp_1 = __importDefault(require("tmp"));
async function createTmpDirectory() {
    const { name } = tmp_1.default.dirSync();
    return fs_extra_1.default.realpathSync(name);
}
exports.createTmpDirectory = createTmpDirectory;
//# sourceMappingURL=createTmpDirectory.js.map