"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const sortPackageJsonFiles_1 = __importDefault(require("./sortPackageJsonFiles"));
module.exports = function ({ modules, appDirectory }) {
    const packageJsonContents = modules.map((moduleName) => {
        return fs_extra_1.default.readJsonSync(path_1.default.join(appDirectory, `src/_modules/${moduleName}/package.json`));
    });
    const sortedModuleNames = sortPackageJsonFiles_1.default(packageJsonContents);
    const externals = [];
    const buildOptions = [];
    for (const moduleName of sortedModuleNames) {
        const indexFile = fs_extra_1.default.existsSync(path_1.default.join(appDirectory, `src/_modules/${moduleName}/index.tsx`))
            ? 'index.tsx'
            : fs_extra_1.default.existsSync(path_1.default.join(appDirectory, `src/_modules/${moduleName}/index.ts`))
                ? 'index.ts'
                : fs_extra_1.default.existsSync(path_1.default.join(appDirectory, `src/_modules/${moduleName}/index.jsx`))
                    ? 'index.jsx'
                    : fs_extra_1.default.existsSync(path_1.default.join(appDirectory, `src/_modules/${moduleName}/index.js`))
                        ? 'index.js'
                        : undefined;
        if (!indexFile)
            continue;
        const declaration = /\.tsx?$/.test(indexFile);
        const file = path_1.default.join(appDirectory, `src/_modules/${moduleName}/${indexFile}`);
        const buildOption = {
            name: moduleName,
            file,
            declaration,
            externals: externals.slice(),
        };
        externals.push(moduleName);
        buildOptions.push(buildOption);
    }
    return Promise.resolve(buildOptions);
};
//# sourceMappingURL=createModuleBuildOptions.js.map