"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectPackageScripts = void 0;
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
//# sourceMappingURL=rules.js.map