"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const getInternalPackageEntry_1 = require("../internalPackage/getInternalPackageEntry");
const sayTitle_1 = require("../utils/sayTitle");
const validatePackage_1 = require("./validatePackage");
async function validatePackages({ cwd }) {
    const entry = await getInternalPackageEntry_1.getInternalPackageEntry({ packageDir: path_1.default.join(cwd, 'src/_packages') });
    for await (const name of entry) {
        sayTitle_1.sayTitle('VALIDATE PACKAGE - ' + name);
        const validation = await validatePackage_1.validatePackage({
            name,
            packageDir: path_1.default.join(cwd, 'src/_packages', name),
        });
        if (validation) {
            for (const v of validation) {
                console.error(chalk_1.default.red.bold(v.message));
            }
        }
    }
}
exports.validatePackages = validatePackages;
//# sourceMappingURL=validatePackages.js.map