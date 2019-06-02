"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
function fsCopySourceFilter(src) {
    if (!/\.(ts|tsx|js|jsx)$/.test(src)) {
        if (fs_extra_1.default.statSync(src).isFile())
            console.log(src);
        return true;
    }
    return false;
}
exports.fsCopySourceFilter = fsCopySourceFilter;
//# sourceMappingURL=fsCopySourceFilter.js.map