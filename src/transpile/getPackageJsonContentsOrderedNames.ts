import { PackageJson } from 'type-fest';

interface PackageJsonSet {
  name: string;
  dependencies: Set<string>;
}

export function getPackageJsonContentsOrderedNames({packageJsonContents}: {packageJsonContents: PackageJson[]}): string[] {
  function searchNestedDependencies(ownerName: string, dependencies: PackageJson.Dependency | undefined, dependenciesSet: Set<string>): Set<string> {
    if (dependencies) {
      Object.keys(dependencies).forEach(dependencyName => {
        if (dependencyName === ownerName) {
          throw new Error(`package.json files have circularly referenced dependencies : "${ownerName}"`);
        }
        
        dependenciesSet.add(dependencyName);
        
        // find dependencyName on the packageJsonContents
        const childPackageJson: PackageJson | undefined = packageJsonContents.find(({name}) => dependencyName === name);
        
        // if childPackageJson is exists search childPackageJson's dependencies
        if (childPackageJson && childPackageJson.dependencies) {
          searchNestedDependencies(ownerName, childPackageJson.dependencies, dependenciesSet);
        }
      });
    }
    
    return dependenciesSet;
  }
  
  return packageJsonContents
    .map<PackageJsonSet>(packageJson => {
      if (!packageJson.name) throw new Error(`Undefined "name" field on ${packageJson}`);
      return {
        name: packageJson.name,
        dependencies: searchNestedDependencies(packageJson.name, packageJson.dependencies, new Set()),
      };
    })
    .sort((a, b) => {
      const aIsHigher: number = 1;
      const bIsHigher: number = -1;
      
      const aHasB: boolean = a.dependencies.has(b.name);
      const bHasA: boolean = b.dependencies.has(a.name);
      
      if (aHasB && bHasA) {
        throw new Error(`"${a.name}" dependent "${b.name}" and "${b.name}" dependent "${a.name}". packages can't be interdependent.`);
      }
      
      return aHasB ? aIsHigher : bIsHigher;
    })
    .map(({name}) => name);
}