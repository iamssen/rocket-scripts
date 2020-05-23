"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fsPackagesCopyFilter = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const rule_1 = require("../rule");
// prettier-ignore
function fsPackagesCopyFilter(src) {
    const pass = (
    // IGNORE PATTERNS
    !/__(\w*)__/.test(src) && // IGNORE : __tests__ , __fixtures__
        !/\.(ts|tsx|mjs|js|jsx)$/.test(src) && // IGNORE : *.ts, *.tsx, *.js, *.jsx, *.mjs
        !rule_1.packageJsonFactoryFileNamePattern.test(src) // IGNORE : .package.json.js
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
exports.fsPackagesCopyFilter = fsPackagesCopyFilter;
//# sourceMappingURL=fsPackagesCopyFilter.js.map