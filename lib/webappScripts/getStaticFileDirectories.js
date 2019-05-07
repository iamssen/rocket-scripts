"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const getInternalPackagePublicDrectories_1 = require("../internalPackage/getInternalPackagePublicDrectories");
async function getStaticFileDirectories({ argv, cwd }) {
    const staticFileDirectories = [];
    if (typeof argv.staticFileDirectories === 'string') {
        const manualDirectories = argv.staticFileDirectories.split(' ')
            .map(directory => path_1.default.join(cwd, directory));
        staticFileDirectories.push(...manualDirectories);
    }
    else {
        const publicDirectory = path_1.default.join(cwd, 'public');
        if (fs_extra_1.default.pathExistsSync(publicDirectory) && fs_extra_1.default.statSync(publicDirectory).isDirectory()) {
            staticFileDirectories.push(publicDirectory);
        }
        const internalPackageDirectories = await getInternalPackagePublicDrectories_1.getInternalPackagePublicDrectories({ cwd });
        staticFileDirectories.push(...internalPackageDirectories);
    }
    if (typeof argv.staticFilePackages === 'string') {
        const packageDirectories = argv.staticFilePackages.split(' ')
            .map(packageName => {
            const paths = [
                ...(require.resolve.paths(packageName) || []),
                path_1.default.join(cwd, 'node_modules'),
            ];
            const packageJson = require.resolve(`${packageName}/package.json`, { paths });
            return path_1.default.join(path_1.default.dirname(packageJson), 'public');
        })
            .filter(directory => fs_extra_1.default.pathExistsSync(directory) && fs_extra_1.default.statSync(directory).isDirectory());
        staticFileDirectories.push(...packageDirectories);
    }
    return staticFileDirectories;
}
exports.getStaticFileDirectories = getStaticFileDirectories;
//# sourceMappingURL=getStaticFileDirectories.js.map