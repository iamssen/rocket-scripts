"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getPackageJsonContentsOrderedNames({ packageJsonContents }) {
    function searchNestedDependencies(ownerName, dependencies, dependenciesSet) {
        if (dependencies) {
            Object.keys(dependencies).forEach(dependencyName => {
                if (dependencyName === ownerName) {
                    throw new Error(`package.json files have circularly referenced dependencies : "${ownerName}"`);
                }
                dependenciesSet.add(dependencyName);
                // find dependencyName on the packageJsonContents
                const childPackageJson = packageJsonContents.find(({ name }) => dependencyName === name);
                // if childPackageJson is exists search childPackageJson's dependencies
                if (childPackageJson && childPackageJson.dependencies) {
                    searchNestedDependencies(ownerName, childPackageJson.dependencies, dependenciesSet);
                }
            });
        }
        return dependenciesSet;
    }
    return packageJsonContents
        .map(packageJson => {
        if (!packageJson.name)
            throw new Error(`Undefined "name" field on ${packageJson}`);
        return {
            name: packageJson.name,
            dependencies: searchNestedDependencies(packageJson.name, packageJson.dependencies, new Set()),
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