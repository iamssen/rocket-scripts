"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function getRendererExternals({ cwd, app }) {
    const file = path_1.default.join(cwd, 'src', app, 'package.json');
    const packageJson = fs_extra_1.default.readJsonSync(file);
    return packageJson.dependencies
        ? Object.keys(packageJson.dependencies)
        : [];
}
exports.getRendererExternals = getRendererExternals;
//# sourceMappingURL=getRendererExternals.js.map