export function getImportedPackagesFromSource(source: string): string[] {
  const testImport: RegExp = / from ['"]([@a-zA-Z][a-zA-Z0-9-_./]*)['"]/g;
  const matchedStrings: string[] = source.match(testImport) || [];
  const packages: string[] = matchedStrings.map((matchedString) => {
    const dependency: string = matchedString.substring(7, matchedString.length - 1);
    const parts: string[] = dependency.split('/');
    const limit: number = /^@/.test(dependency) ? 2 : 1;
    return parts.length > limit ? parts.slice(0, limit).join('/') : dependency;
  });
  return Array.from(new Set(packages));
}
