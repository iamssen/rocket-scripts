"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAppDependencies = void 0;
const semver_1 = __importDefault(require("semver"));
function validateAppDependencies({ projectPackageJson, appPackageJson: { dependencies } }) {
    if (dependencies && projectPackageJson.dependencies) {
        for (const name of Object.keys(dependencies)) {
            if (!projectPackageJson.dependencies[name]) {
                throw new Error(`"${name}" is undefined in projectPackageJson`);
            }
            const a = dependencies[name];
            const b = projectPackageJson.dependencies[name];
            if (!semver_1.default.intersects(a, b)) {
                throw new Error(`The versions of "${name}" are not intersects`);
            }
        }
    }
}
exports.validateAppDependencies = validateAppDependencies;
//# sourceMappingURL=validateAppDependencies.js.map