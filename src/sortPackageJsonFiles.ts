interface PackageJson {
  name: string;
  dependencies?: {[name: string]: string};
}

export = function (packageJsonFiles: PackageJson[]): string[] {
  function searchNestedDependencies(index: Set<string>, dependencies: PackageJson['dependencies']): Set<string> {
    if (dependencies) {
      Object.keys(dependencies).forEach(dependencyName => {
        index.add(dependencyName);
        
        const packageJsonFile: PackageJson | undefined = packageJsonFiles.find(({name}) => dependencyName === name);
        
        if (packageJsonFile) {
          searchNestedDependencies(index, packageJsonFile.dependencies);
        }
      });
    }
    
    return index;
  }
  
  return packageJsonFiles
    .map(({name, dependencies}) => {
      return {
        name,
        dependencies: searchNestedDependencies(new Set(), dependencies),
      };
    })
    .sort((a, b) => {
      const aIsHigher: number = 1;
      const bIsHigher: number = -1;
      
      const aHasB: boolean = a.dependencies.has(b.name);
      const bHasA: boolean = b.dependencies.has(a.name);
      
      if (aHasB && bHasA) {
        throw new Error(`😨 "${a.name}" dependent "${b.name}" and "${b.name}" dependent "${a.name}". Modules can't be interdependent.`);
      }
      
      return aHasB ? aIsHigher : bIsHigher;
    })
    .map(packageJsonFile => packageJsonFile.name);
}