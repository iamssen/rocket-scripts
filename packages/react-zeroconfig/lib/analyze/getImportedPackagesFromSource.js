"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getImportedPackagesFromSource(source) {
    const testImport = / from ['"]([@a-zA-Z][a-zA-Z0-9-_./]*)['"]/g;
    const matchedStrings = source.match(testImport) || [];
    const packages = matchedStrings.map((matchedString) => {
        const dependency = matchedString.substring(7, matchedString.length - 1);
        const parts = dependency.split('/');
        const limit = /^@/.test(dependency) ? 2 : 1;
        return parts.length > limit ? parts.slice(0, limit).join('/') : dependency;
    });
    return Array.from(new Set(packages));
}
exports.getImportedPackagesFromSource = getImportedPackagesFromSource;
//# sourceMappingURL=getImportedPackagesFromSource.js.map