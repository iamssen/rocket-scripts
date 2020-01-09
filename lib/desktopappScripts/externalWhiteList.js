"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function externalWhiteList({ cwd, app }) {
    const file = path_1.default.join(cwd, 'src', app, 'external-whitelist.js');
    return fs_extra_1.default.pathExistsSync(file) ? require(file) : [];
}
exports.externalWhiteList = externalWhiteList;
//# sourceMappingURL=externalWhiteList.js.map