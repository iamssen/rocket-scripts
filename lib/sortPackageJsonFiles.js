"use strict";
module.exports = function (packageJsonFiles) {
    function searchNestedDependencies(index, dependencies) {
        if (dependencies) {
            Object.keys(dependencies).forEach(dependencyName => {
                index.add(dependencyName);
                const packageJsonFile = packageJsonFiles.find(({ name }) => dependencyName === name);
                if (packageJsonFile) {
                    searchNestedDependencies(index, packageJsonFile.dependencies);
                }
            });
        }
        return index;
    }
    return packageJsonFiles
        .map(({ name, dependencies }) => {
        return {
            name,
            dependencies: searchNestedDependencies(new Set(), dependencies),
        };
    })
        .sort((a, b) => {
        const aIsHigher = 1;
        const bIsHigher = -1;
        const aHasB = a.dependencies.has(b.name);
        const bHasA = b.dependencies.has(a.name);
        if (aHasB && bHasA) {
            throw new Error(`😨 "${a.name}" dependent "${b.name}" and "${b.name}" dependent "${a.name}". Modules can't be interdependent.`);
        }
        return aHasB ? aIsHigher : bIsHigher;
    })
        .map(packageJsonFile => packageJsonFile.name);
};
//# sourceMappingURL=sortPackageJsonFiles.js.map