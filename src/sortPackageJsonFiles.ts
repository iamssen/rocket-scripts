export = function (packageJsonFiles: {name: string, dependencies?: {[name: string]: string}}[]): string[] {
  return packageJsonFiles
    .sort((a, b) => {
      const aIsHigher: number = -1;
      const bIsHigher: number = 1;
      
      const aHasB: boolean = Boolean(a.dependencies && a.dependencies[b.name]);
      const bHasA: boolean = Boolean(b.dependencies && b.dependencies[a.name]);
      
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
}