"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function copyStaticFiles({ from, to, cwd }) {
    await fs_extra_1.default.copy(path_1.default.join(cwd, 'src/_packages', buildOption.name), path_1.default.join(cwd, 'dist/packages', buildOption.name), {
        filter: src => {
            if (!/\.(ts|tsx|js|jsx)$/.test(src)) {
                if (fs_extra_1.default.statSync(src).isFile())
                    console.log(src);
                return true;
            }
            return false;
        },
    });
}
exports.copyStaticFiles = copyStaticFiles;
//# sourceMappingURL=copyStaticFiles.js.map