"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getPackageJsonContentsOrderedNames({ packageJsonContents }) {
    function searchNestedDependencies(index, dependencies) {
        if (dependencies) {
            Object.keys(dependencies).forEach(dependencyName => {
                index.add(dependencyName);
                const packageJsonFile = packageJsonContents.find(({ name }) => dependencyName === name);
                if (packageJsonFile) {
                    searchNestedDependencies(index, packageJsonFile.dependencies);
                }
            });
        }
        return index;
    }
    return packageJsonContents
        .map(packageJson => {
        if (!packageJson.name)
            throw new Error(`Undefined "name" field on ${packageJson}`);
        return {
            name: packageJson.name,
            dependencies: searchNestedDependencies(new Set(), packageJson.dependencies),
        };
    })
        .sort((a, b) => {
        const aIsHigher = 1;
        const bIsHigher = -1;
        const aHasB = a.dependencies.has(b.name);
        const bHasA = b.dependencies.has(a.name);
        if (aHasB && bHasA) {
            throw new Error(`"${a.name}" dependent "${b.name}" and "${b.name}" dependent "${a.name}". packages can't be interdependent.`);
        }
        return aHasB ? aIsHigher : bIsHigher;
    })
        .map(({ name }) => name);
}
exports.getPackageJsonContentsOrderedNames = getPackageJsonContentsOrderedNames;
//# sourceMappingURL=getPackageJsonContentsOrderedNames.js.map