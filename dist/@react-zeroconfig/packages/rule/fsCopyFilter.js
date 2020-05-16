"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fsCopyFilter = void 0;
const fileNames_1 = require("./fileNames");
const fs_extra_1 = __importDefault(require("fs-extra"));
// prettier-ignore
function fsCopyFilter(src) {
    const pass = (
    // IGNORE PATTERNS
    !/__(\w*)__/.test(src) && // IGNORE : __tests__ , __fixtures__
        !/\.(ts|tsx|mjs|js|jsx)$/.test(src) && // IGNORE : *.ts, *.tsx, *.js, *.jsx, *.mjs
        !fileNames_1.packageJsonFactoryFileNamePattern.test(src) // IGNORE : .package.json.js
    ) ||
        // OK PATTERNS
        /\.d\.ts$/.test(src) || // OK : *.d.ts
        /\/bin\/[a-zA-Z0-9._-]+.js$/.test(src); // OK : bin/*.js
    if (pass && !process.env.JEST_WORKER_ID) {
        if (fs_extra_1.default.statSync(src).isFile())
            console.log(src);
    }
    return pass;
}
exports.fsCopyFilter = fsCopyFilter;
//# sourceMappingURL=fsCopyFilter.js.map