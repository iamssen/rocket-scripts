"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedConfig = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const fileNames_1 = require("./fileNames");
function getSharedConfig({ cwd }) {
    const sharedConfigFile = path_1.default.join(cwd, fileNames_1.sharedPackageJsonFileName);
    return fs_extra_1.default.existsSync(sharedConfigFile) ? fs_extra_1.default.readJsonSync(sharedConfigFile) : {};
}
exports.getSharedConfig = getSharedConfig;
//# sourceMappingURL=getSharedConfig.js.map