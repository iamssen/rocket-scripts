"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_extra_1 = __importDefault(require("fs-extra"));
const package_json_1 = __importDefault(require("package-json"));
const path_1 = __importDefault(require("path"));
function getNpmRemoteVersion(name, version) {
    return package_json_1.default(name, { version })
        .then((value) => {
        return value && typeof value.version === 'string' ? value.version : undefined;
    })
        .catch(() => {
        return undefined;
    });
}
module.exports = function ({ modules, appDirectory, version, getRemoteVersion = getNpmRemoteVersion }) {
    const modulesDirectory = path_1.default.join(appDirectory, 'dist/modules');
    if (!fs_extra_1.default.existsSync(modulesDirectory) || !fs_extra_1.default.statSync(modulesDirectory).isDirectory()) {
        return Promise.reject(new Error(`"${modulesDirectory}" directory is undefined`));
    }
    return Promise.all(modules
        .map((moduleName) => {
        return path_1.default.join(modulesDirectory, moduleName, 'package.json');
    })
        .filter((packageJsonPath) => {
        return fs_extra_1.default.existsSync(packageJsonPath);
    })
        .map((packageJsonPath) => {
        const workingPackageJson = fs_extra_1.default.readJsonSync(packageJsonPath);
        return {
            name: workingPackageJson.name,
            workingVersion: workingPackageJson.version,
        };
    })
        .map(({ name, workingVersion }) => {
        return getRemoteVersion(name, version).then((remoteVersion) => {
            return {
                name,
                workingVersion,
                remoteVersion,
            };
        });
    }));
};
//# sourceMappingURL=createPublishOptions.js.map