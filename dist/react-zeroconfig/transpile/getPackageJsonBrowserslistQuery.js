"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageJsonBrowserslistQuery = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
async function getPackageJsonBrowserslistQuery({ packageJson, }) {
    const { browserslist } = await fs_extra_1.default.readJson(packageJson, { encoding: 'utf8' });
    if (typeof browserslist === 'string' || Array.isArray(browserslist)) {
        return browserslist;
    }
    return undefined;
}
exports.getPackageJsonBrowserslistQuery = getPackageJsonBrowserslistQuery;
//# sourceMappingURL=getPackageJsonBrowserslistQuery.js.map