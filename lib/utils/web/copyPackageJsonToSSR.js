"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
module.exports = function ({ appDirectory, outputPath }) {
    return new Promise((resolve) => {
        const { name, dependencies } = fs_extra_1.default.readJsonSync(path_1.default.join(appDirectory, 'package.json'));
        fs_extra_1.default.mkdirpSync(path_1.default.dirname(outputPath));
        fs_extra_1.default.writeJsonSync(outputPath, {
            name,
            dependencies,
        }, { encoding: 'utf8' });
        resolve();
    });
};
//# sourceMappingURL=copyPackageJsonToSSR.js.map