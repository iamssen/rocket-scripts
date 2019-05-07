import { PackageJson } from 'type-fest';

interface PackageJsonSet {
  name: string;
  dependencies: Set<string>;
}

export function getPackageJsonContentsOrderedNames({packageJsonContents}: {packageJsonContents: PackageJson[]}): string[] {
  function searchNestedDependencies(index: Set<string>, dependencies: PackageJson.Dependency | undefined): Set<string> {
    if (dependencies) {
      Object.keys(dependencies).forEach(dependencyName => {
        index.add(dependencyName);
        
        const packageJsonFile: PackageJson | undefined = packageJsonContents.find(({name}) => dependencyName === name);
        
        if (packageJsonFile) {
          searchNestedDependencies(index, packageJsonFile.dependencies);
        }
      });
    }
    
    return index;
  }
  
  return packageJsonContents
    .map<PackageJsonSet>(packageJson => {
      if (!packageJson.name) throw new Error(`Undefined "name" field on ${packageJson}`);
      return {
        name: packageJson.name,
        dependencies: searchNestedDependencies(new Set(), packageJson.dependencies),
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