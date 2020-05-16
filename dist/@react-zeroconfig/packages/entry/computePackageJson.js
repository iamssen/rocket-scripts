"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computePackageJson = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const fileNames_1 = require("../rule/fileNames");
function computePackageJson({ packageDir, packageInfo, dependencies, sharedConfig = {}, }) {
    const shared = { ...sharedConfig };
    Object.keys(shared).forEach((key) => {
        const value = shared[key];
        if (typeof value === 'string') {
            shared[key] = value
                .replace(/({name})/g, packageInfo.name) // {name}
                .replace(/({version})/g, packageInfo.version); // {version}
        }
    });
    const computedConfig = {
        ...shared,
        name: packageInfo.name,
        version: packageInfo.version,
        dependencies: dependencies,
        main: 'index.js',
        typings: 'index.d.ts',
    };
    const factoryFile = path_1.default.join(packageDir, fileNames_1.packageJsonFactoryFileName);
    return fs_extra_1.default.existsSync(factoryFile) ? require(factoryFile)(computedConfig) : computedConfig;
}
exports.computePackageJson = computePackageJson;
//# sourceMappingURL=computePackageJson.js.map