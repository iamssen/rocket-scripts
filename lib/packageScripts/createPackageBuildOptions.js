"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const getPackageJsonContentsOrderedNames_1 = require("../transpile/getPackageJsonContentsOrderedNames");
const glob_promise_1 = require("../utils/glob-promise");
async function createPackageBuildOptions({ entry, cwd }) {
    const packageJsonContents = await Promise.all(entry.map(packageName => fs_extra_1.default.readJson(path_1.default.join(cwd, `src/_packages/${packageName}/package.json`))));
    const orderedNames = getPackageJsonContentsOrderedNames_1.getPackageJsonContentsOrderedNames({ packageJsonContents });
    const externals = [];
    const buildOptions = [];
    for (const name of orderedNames) {
        const indexFileSearchResult = await glob_promise_1.glob(`${cwd}/src/_packages/${name}/index.{js,jsx,ts,tsx}`);
        if (indexFileSearchResult.length === 0) {
            throw new Error(`Undefined index file on "${cwd}/src/_packages/${name}"`);
        }
        else if (indexFileSearchResult.length > 1) {
            throw new Error(`Only one index file must exist : "${indexFileSearchResult.join(', ')}"`);
        }
        const file = indexFileSearchResult[0];
        buildOptions.push({
            name,
            file,
            buildTypescriptDeclaration: /\.tsx?$/.test(file),
            externals: [...externals],
        });
        externals.push(name);
    }
    return buildOptions;
}
exports.createPackageBuildOptions = createPackageBuildOptions;
//# sourceMappingURL=createPackageBuildOptions.js.map