"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const getImportedPackagesFromFiles_1 = require("../analyze/getImportedPackagesFromFiles");
const glob_promise_1 = require("../utils/glob-promise");
async function findInternalPackageMissingDependencies({ packageDir }) {
    const packageJson = path_1.default.join(packageDir, 'package.json');
    if (!fs_extra_1.default.pathExistsSync(packageJson)) {
        throw new Error('package.json이 없는 directory는 입력되면 안된다!');
    }
    const sourceFiles = await glob_promise_1.glob(`${packageDir}/**/*.{js,jsx,mjs,ts,tsx}`, {
        ignore: [
            '**/public/**/*',
            '**/__*__/**/*',
            '**/*.{stories,story,test,spec}.{js,jsx,mjs,ts,tsx}',
        ],
    });
    if (sourceFiles.length === 0)
        return undefined;
    const { dependencies, devDependencies, peerDependencies, optionalDependencies, } = await fs_extra_1.default.readJson(packageJson);
    const wrotePackages = new Set([
        ...Object.keys(dependencies || {}),
        ...Object.keys(devDependencies || {}),
        ...Object.keys(peerDependencies || {}),
        ...Object.keys(optionalDependencies || {}),
    ]);
    const importedPackages = await getImportedPackagesFromFiles_1.getImportedPackagesFromFiles(sourceFiles);
    for (const packageName of importedPackages) {
        if (wrotePackages.has(packageName)) {
            importedPackages.delete(packageName);
        }
    }
    return importedPackages.size > 0
        ? importedPackages
        : undefined;
}
exports.findInternalPackageMissingDependencies = findInternalPackageMissingDependencies;
//# sourceMappingURL=findInternalPackageMissingDependencies.js.map