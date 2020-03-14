"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
// https://github.com/eslint/eslint/blob/master/lib/cli-engine/config-array-factory.js#L52
const configFilenames = [
    '.eslintrc.js',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    '.eslintrc.json',
    '.eslintrc',
];
function eslintConfigExistsSync({ cwd }) {
    for (const filename of configFilenames) {
        if (fs_extra_1.default.pathExistsSync(filename)) {
            return true;
        }
    }
    const { eslintConfig } = fs_extra_1.default.readJsonSync(path_1.default.join(cwd, 'package.json'));
    return typeof eslintConfig === 'object';
}
exports.eslintConfigExistsSync = eslintConfigExistsSync;
//# sourceMappingURL=eslintConfigExistsSync.js.map