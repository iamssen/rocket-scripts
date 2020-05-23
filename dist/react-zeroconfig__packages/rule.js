"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectPackageScripts = exports.packageJsonFactoryFileNamePattern = exports.packageJsonFactoryFileName = exports.sharedPackageJsonFileName = exports.packagesFileName = void 0;
exports.packagesFileName = '.zeroconfig.packages.yaml';
exports.sharedPackageJsonFileName = '.zeroconfig.package.json';
exports.packageJsonFactoryFileName = '.package.json.js';
exports.packageJsonFactoryFileNamePattern = /.package.json.js$/;
exports.collectPackageScripts = {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    excludes: [
        // exclude tests
        '**/*.spec.js',
        '**/*.spec.jsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/*.test.js',
        '**/*.test.jsx',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/__tests__',
        '**/__test__',
        // exclude public
        '**/public',
    ],
    includes: ['**/*'],
};
//# sourceMappingURL=rule.js.map