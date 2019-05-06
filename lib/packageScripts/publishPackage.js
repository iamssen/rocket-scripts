"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
function publishPackage({ publishOption, cwd, exec = child_process_1.execSync }) {
    const { name } = publishOption;
    return exec(process.platform === 'win32'
        ? `cd "${path_1.default.join(cwd, 'dist/packages', name)}" && npm publish`
        : `cd "${path_1.default.join(cwd, 'dist/packages', name)}"; npm publish;`).toString();
}
exports.publishPackage = publishPackage;
//# sourceMappingURL=publishPackage.js.map