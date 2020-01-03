"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function copyElectronPackageJson({ file, app, copyTo }) {
    const { dependencies, devDependencies } = await fs_extra_1.default.readJson(file);
    const appPackageJson = (await fs_extra_1.default.pathExistsSync(app))
        ? await fs_extra_1.default.readJson(app)
        : {};
    await fs_extra_1.default.mkdirp(path_1.default.dirname(copyTo));
    const content = {
        main: 'main.js',
        dependencies,
        devDependencies,
        ...appPackageJson,
    };
    await fs_extra_1.default.writeJson(copyTo, content, { encoding: 'utf8' });
}
exports.copyElectronPackageJson = copyElectronPackageJson;
//# sourceMappingURL=copyElectronPackageJson.js.map