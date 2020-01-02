"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const nodemon_1 = __importDefault(require("nodemon"));
const path_1 = __importDefault(require("path"));
const copyElectronPackageJson_1 = require("../runners/copyElectronPackageJson");
const watingFiles_1 = require("../runners/watingFiles");
const sayTitle_1 = require("../utils/sayTitle");
async function startElectron({ cwd, output, }) {
    const file = path_1.default.join(output, 'electron/main.js');
    const dir = path_1.default.join(output, 'electron');
    await watingFiles_1.watingFiles([file]);
    if (!fs_extra_1.default.pathExistsSync(path_1.default.join(output, 'electron/node_modules'))) {
        await fs_extra_1.default.mkdirp(dir);
        await fs_extra_1.default.symlink(path_1.default.join(cwd, 'node_modules'), path_1.default.join(output, 'electron/node_modules'));
    }
    sayTitle_1.sayTitle('START ELECTRON');
    await copyElectronPackageJson_1.copyElectronPackageJson({
        file: path_1.default.join(cwd, 'package.json'),
        copyTo: path_1.default.join(output, 'electron/package.json'),
    });
    nodemon_1.default({
        watch: [file],
        exec: `electron ${dir}`,
    });
}
exports.startElectron = startElectron;
//# sourceMappingURL=startElectron.js.map