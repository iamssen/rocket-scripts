"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_extra_1 = __importDefault(require("fs-extra"));
const sortPackageJsonFiles_1 = __importDefault(require("./sortPackageJsonFiles"));
module.exports = function ({ modules, appDirectory }) {
    const packageJsonFiles = Object.keys(modules).map(name => {
        const groupDirectory = modules[name].group ? modules[name].group + '/' : '';
        return fs_extra_1.default.readJsonSync(`${appDirectory}/src/_modules/${groupDirectory}${name}`);
    });
    const sortedModuleNames = sortPackageJsonFiles_1.default(packageJsonFiles);
    const externals = [];
    const buildOptions = sortedModuleNames.map(name => {
        const group = modules[name].group;
        const groupDirectory = group ? group + '/' : '';
        const indexFile = fs_extra_1.default.existsSync(`${appDirectory}/src/_modules/${groupDirectory}${name}/index.tsx`)
            ? 'index.tsx'
            : 'index.ts';
        const file = `${appDirectory}/src/_modules/${groupDirectory}${name}/${indexFile}`;
        const buildOption = {
            name,
            group,
            groupDirectory,
            file,
            externals: externals.slice(),
        };
        externals.push(`${groupDirectory}${name}`);
        return buildOption;
    });
    return Promise.resolve(buildOptions);
};
//# sourceMappingURL=createModuleBuildOptions.js.map