"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getBackdoorWebpackConfig({ cwd }) {
    const patchFile = path_1.default.join(cwd, 'experimentalPatch.js');
    if (!fs_1.default.existsSync(patchFile))
        return {};
    return require(patchFile)();
}
exports.getBackdoorWebpackConfig = getBackdoorWebpackConfig;
//# sourceMappingURL=getBackdoorWebpackConfig.js.map