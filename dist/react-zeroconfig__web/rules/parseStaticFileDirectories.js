"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStaticFileDirectories = void 0;
const path_1 = __importDefault(require("path"));
// <package>/public -> node_modules/package/public | src/package/public
// $CWD/public -> /project/root/public
// /path/to/$APP/public -> /path/to/app/public
function parseStaticFileDirectories({ cwd, app, staticFileDirectories }) {
    return staticFileDirectories.map((dir) => {
        if (dir === '{default_paths}')
            return path_1.default.join(cwd, 'public');
        return dir.replace(/{app}/g, app).replace(/{cwd}/g, cwd);
    });
}
exports.parseStaticFileDirectories = parseStaticFileDirectories;
//# sourceMappingURL=parseStaticFileDirectories.js.map