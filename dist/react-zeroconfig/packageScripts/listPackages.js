"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const getInternalPackageEntry_1 = require("../internalPackage/getInternalPackageEntry");
const sayTitle_1 = require("../utils/sayTitle");
async function listPackages({ cwd }) {
    const entry = getInternalPackageEntry_1.getInternalPackageEntry({ packageDir: path_1.default.join(cwd, 'src/_packages') });
    const n = (name) => {
        return entry.indexOf(name) > -1 ? chalk_1.default.bold.blue(name) : name;
    };
    function nv(name, version) {
        return n(name) + chalk_1.default.green('@' + version);
    }
    function tree(name, dependencies) {
        if (dependencies) {
            console.log(chalk_1.default.gray('└── ') + n(name));
            const packageNames = Object.keys(dependencies);
            packageNames.forEach((packageName, i) => {
                if (i === packageNames.length - 1) {
                    console.log(chalk_1.default.gray(`    └── `) + nv(packageName, dependencies[packageName]));
                }
                else {
                    console.log(chalk_1.default.gray(`    ├── `) + nv(packageName, dependencies[packageName]));
                }
            });
        }
    }
    sayTitle_1.sayTitle('LIST DEPENDENCIES');
    for await (const name of entry) {
        const { version, dependencies, devDependencies, peerDependencies, optionalDependencies, } = await fs_extra_1.default.readJsonSync(path_1.default.join(cwd, 'src/_packages', name, 'package.json'));
        console.log(nv(name, version));
        tree('dependencies', dependencies);
        tree('devDependencies', devDependencies);
        tree('peerDependencies', peerDependencies);
        tree('optionalDependencies', optionalDependencies);
    }
}
exports.listPackages = listPackages;
//# sourceMappingURL=listPackages.js.map