"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const semver_1 = require("semver");
const getInternalPackageEntry_1 = require("../internalPackage/getInternalPackageEntry");
async function findMissingDependencies({ cwd }) {
    const hostPackageJson = await fs_extra_1.default.readJson(path_1.default.join(cwd, 'package.json'));
    const entry = await getInternalPackageEntry_1.getInternalPackageEntry({ packageDir: path_1.default.join(cwd, 'src/_packages') });
    const modulePackageJsons = await Promise.all(entry.map(packageName => fs_extra_1.default.readJson(path_1.default.join(cwd, 'src/_packages', packageName, 'package.json'))));
    const hostDependencies = hostPackageJson.dependencies || {};
    const moduleDependencies = Object.assign({}, ...modulePackageJsons.map(({ dependencies }) => dependencies));
    for (const packageName of entry) {
        if (moduleDependencies[packageName]) {
            delete moduleDependencies[packageName];
        }
    }
    for (const packageName of Object.keys(moduleDependencies)) {
        if (hostDependencies[packageName]) {
            if (!semver_1.intersects(hostDependencies[packageName], moduleDependencies[packageName])) {
                throw new Error(`${packageName}@${hostDependencies[packageName]} of package.json and ${packageName}@${moduleDependencies[packageName]} are not intersects!`);
            }
        }
    }
    const missingDependencies = { ...moduleDependencies };
    for (const packageName of Object.keys(missingDependencies)) {
        if (hostDependencies[packageName]) {
            delete missingDependencies[packageName];
        }
    }
    return missingDependencies;
}
exports.findMissingDependencies = findMissingDependencies;
//# sourceMappingURL=findMissingDependencies.js.map