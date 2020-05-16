"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackagesEntry = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const path_1 = __importDefault(require("path"));
const fileNames_1 = require("./fileNames");
async function getPackagesEntry({ cwd }) {
    const source = await fs_extra_1.default.readFile(path_1.default.join(cwd, fileNames_1.packagesFileName), {
        encoding: 'utf8',
    });
    const packages = js_yaml_1.default.safeLoad(source);
    return Object.keys(packages).reduce((map, name) => {
        const versionOrInfo = packages[name];
        const version = typeof versionOrInfo === 'string' ? versionOrInfo : versionOrInfo.version;
        const tag = typeof versionOrInfo === 'string' ? 'latest' : versionOrInfo.tag || 'latest';
        map.set(name, {
            name,
            version,
            tag,
        });
        return map;
    }, new Map());
}
exports.getPackagesEntry = getPackagesEntry;
//# sourceMappingURL=getPackagesEntry.js.map