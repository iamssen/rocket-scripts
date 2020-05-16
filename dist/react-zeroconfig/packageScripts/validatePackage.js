"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePackage = void 0;
const findInternalPackageMissingDependencies_1 = require("../internalPackage/findInternalPackageMissingDependencies");
async function validatePackage({ name, packageDir, }) {
    const missingPackages = await findInternalPackageMissingDependencies_1.findInternalPackageMissingDependencies({ packageDir });
    if (missingPackages) {
        const errors = [];
        if (missingPackages.has(name)) {
            //errors.push(new Error(`Don't import "${name}" itself inside "${name}"`));
            missingPackages.delete(name);
        }
        if (missingPackages.size > 0) {
            errors.push(new Error(`There are dependencies imported inside package "${name}" but not added to "${name}/package.json". please add ${Array.from(missingPackages)
                .map((p) => '"' + p + '"')
                .join(', ')} to "${name}/package.json".`));
        }
        return errors;
    }
    return undefined;
}
exports.validatePackage = validatePackage;
//# sourceMappingURL=validatePackage.js.map