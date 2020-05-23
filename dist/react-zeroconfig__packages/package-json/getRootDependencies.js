"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRootDependencies = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function getRootDependencies({ cwd }) {
    const packageJson = await fs_extra_1.default.readJson(path_1.default.join(cwd, 'package.json'));
    return {
        ...packageJson.devDependencies,
        ...packageJson.dependencies,
    };
}
exports.getRootDependencies = getRootDependencies;
//# sourceMappingURL=getRootDependencies.js.map