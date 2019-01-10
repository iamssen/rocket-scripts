"use strict";
module.exports = function (packageJsonFiles) {
    return packageJsonFiles
        .sort((a, b) => {
        const aIsHigher = -1;
        const bIsHigher = 1;
        const aHasB = Boolean(a.dependencies && a.dependencies[b.name]);
        const bHasA = Boolean(b.dependencies && b.dependencies[a.name]);
        if (aHasB && bHasA) {
            throw new Error(`😨 "${a.name}" dependent "${b.name}" and "${b.name}" dependent "${a.name}". Modules can't be interdependent.`);
        }
        return aHasB
            ? bIsHigher
            : bHasA
                ? aIsHigher
                : a.name < b.name ? aIsHigher : bIsHigher;
    })
        .map(packageJsonFile => packageJsonFile.name);
};
//# sourceMappingURL=sortPackageJsonFiles.js.map