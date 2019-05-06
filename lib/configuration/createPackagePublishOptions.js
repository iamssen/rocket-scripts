"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const package_json_1 = __importDefault(require("package-json"));
const path_1 = __importDefault(require("path"));
const getNpmRemotePackageJson = ({ name, ...options }) => {
    return package_json_1.default(name, {
        version: 'latest',
        fullMetadata: true,
        ...options,
    }).then(value => value && typeof value.version === 'string' ? value : undefined)
        .catch(() => undefined);
};
async function createPackagePublishOptions({ entry, cwd, version, getRemotePackageJson = getNpmRemotePackageJson }) {
    const packageDirectory = path_1.default.join(cwd, 'dist/packages');
    if (!fs_extra_1.default.pathExistsSync(packageDirectory) || !fs_extra_1.default.statSync(packageDirectory).isDirectory()) {
        throw new Error(`"${packageDirectory}" directory is undefined`);
    }
    const currentPackageJsons = entry
        .map(packageName => path_1.default.join(packageDirectory, packageName, 'package.json'))
        .filter(packageJsonFile => fs_extra_1.default.existsSync(packageJsonFile))
        .map(packageJsonFile => fs_extra_1.default.readJsonSync(packageJsonFile))
        .filter(({ name }) => typeof name === 'string');
    const remotePackageJsons = await Promise.all(currentPackageJsons.map(({ name }) => getRemotePackageJson({ name: name, version, fullMetadata: true })));
    return currentPackageJsons.map((currentPackageJson, i) => ({
        name: currentPackageJson.name,
        currentPackageJson,
        remotePackageJson: remotePackageJsons[i],
    }));
}
exports.createPackagePublishOptions = createPackagePublishOptions;
//# sourceMappingURL=createPackagePublishOptions.js.map