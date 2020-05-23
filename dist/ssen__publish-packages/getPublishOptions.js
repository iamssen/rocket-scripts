"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublishOptions = void 0;
const flat_package_name_1 = require("@ssen/flat-package-name");
const fs_extra_1 = __importDefault(require("fs-extra"));
const package_json_1 = __importDefault(require("package-json"));
const path_1 = __importDefault(require("path"));
const getNpmRemotePackageJson = ({ name, ...options }) => {
    return package_json_1.default(name, options)
        .then((value) => (value && typeof value.version === 'string' ? value : undefined))
        .catch(() => undefined);
};
async function getPublishOptions({ entry, outDir, tag: forceTag, registry: forceRegistry, getRemotePackageJson = getNpmRemotePackageJson, }) {
    if (!fs_extra_1.default.existsSync(outDir) || !fs_extra_1.default.statSync(outDir).isDirectory()) {
        throw new Error(`"${outDir}" directory is not exists`);
    }
    const tags = new Map();
    for (const [name, { tag }] of entry) {
        tags.set(name, tag || 'latest');
    }
    const currentPackageJsons = Array.from(entry.values())
        // PackageInfo => /path/to/dist/{name}/package.json
        .map(({ name: packageName }) => path_1.default.join(outDir, flat_package_name_1.flatPackageName(packageName), 'package.json'))
        // /path/to/dist/{name}/package.json => boolean
        .filter((packageJsonFile) => fs_extra_1.default.existsSync(packageJsonFile))
        // /path/to/dist/{name}/package.json => PackageJson
        .map((packageJsonFile) => fs_extra_1.default.readJsonSync(packageJsonFile))
        // PackageJson => boolean
        .filter(({ name }) => typeof name === 'string');
    const remotePackageJsons = await Promise.all(currentPackageJsons.map(({ name }) => {
        if (!name)
            throw new Error(``);
        return getRemotePackageJson({
            name,
            version: forceTag || tags.get(name),
            registryUrl: forceRegistry,
            fullMetadata: true,
        });
    }));
    return Array.from(entry.values()).reduce((map, current, i) => {
        if (!current.name)
            throw new Error(``);
        map.set(current.name, {
            name: current.name,
            tag: tags.get(current.name),
            current,
            remote: remotePackageJsons[i],
        });
        return map;
    }, new Map());
}
exports.getPublishOptions = getPublishOptions;
//# sourceMappingURL=getPublishOptions.js.map