"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const filter = /\.(ts|tsx|js|jsx)$/;
module.exports = function ({ buildOption, appDirectory }) {
    //const publicPath: string = path.join(appDirectory, `src/_modules/${buildOption.name}/public`);
    //const outputPath: string = path.join(appDirectory, `dist/modules/${buildOption.name}/public`);
    //
    //if (!fs.existsSync(publicPath) || !fs.statSync(publicPath).isDirectory()) {
    //  return Promise.resolve();
    //}
    //
    //return fs.copy(publicPath, outputPath, {dereference: true});
    return fs_extra_1.default.copy(path_1.default.join(appDirectory, `src/_modules/${buildOption.name}`), path_1.default.join(appDirectory, `dist/modules/${buildOption.name}`), {
        filter: src => !filter.test(src),
    });
};
//# sourceMappingURL=copyModuleStaticFiles.js.map