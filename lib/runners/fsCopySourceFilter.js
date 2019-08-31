"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
function fsCopySourceFilter(src) {
    if (!/\.(ts|tsx|mjs|js|jsx)$/.test(src) || /\.d\.ts$/.test(src) || /\/bin\/[a-zA-Z0-9._-]+.js$/.test(src)) {
        if (!process.env.JEST_WORKER_ID) {
            if (fs_extra_1.default.statSync(src).isFile())
                console.log(src);
        }
        return true;
    }
    return false;
}
exports.fsCopySourceFilter = fsCopySourceFilter;
//# sourceMappingURL=fsCopySourceFilter.js.map