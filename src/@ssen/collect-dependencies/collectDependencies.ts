import { PackageJson } from 'type-fest';
import ts from 'typescript';
import { PackageInfo } from './types';

export const collectTypeScript: { extensions: string[]; excludes: string[]; includes: string[] } = {
  extensions: ['.ts', '.tsx'],
  excludes: [
    // exclude tests
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/__tests__',
    '**/__test__',

    // exclude public
    '**/public',

    // exclude javascript
    '**/*.js',
    '**/*.jsx',
  ],
  includes: ['**/*'],
};

export const collectScripts: { extensions: string[]; excludes: string[]; includes: string[] } = {
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

interface CollectDependenciesParams {
  rootDir: string;
  internalPackages: Map<string, PackageInfo>;
  externalPackages: PackageJson.Dependency;
  extensions?: string[];
  excludes?: string[];
  includes?: string[];
  compilerOptions?: ts.CompilerOptions;
}

export async function collectDependencies({
  rootDir,
  internalPackages,
  externalPackages,
  extensions = collectTypeScript.extensions,
  excludes = collectTypeScript.excludes,
  includes = collectTypeScript.includes,
  compilerOptions = {},
}: CollectDependenciesParams): Promise<PackageJson.Dependency> {
  compilerOptions = {
    allowJs: extensions.some((ext) => /^.js/.test(ext)),
    ...compilerOptions,
    rootDir,
  };

  const host: ts.CompilerHost = ts.createCompilerHost(compilerOptions);

  const files: string[] = host.readDirectory!(rootDir, extensions, excludes, includes);

  const program: ts.Program = ts.createProgram(files, compilerOptions, host);

  const importPaths: Set<string> = new Set<string>();

  for (const file of files) {
    const sourceFile: ts.SourceFile | undefined = program.getSourceFile(file);

    if (!sourceFile) continue;

    function search(node: ts.Node) {
      // import from '?'
      if (ts.isImportDeclaration(node) && ts.isStringLiteralLike(node.moduleSpecifier) && node.moduleSpecifier.text) {
        importPaths.add(node.moduleSpecifier.text);
      }
      // import('?')
      else if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword &&
        ts.isStringLiteralLike(node.arguments[0])
      ) {
        importPaths.add((node.arguments[0] as ts.StringLiteralLike).text);
      }
      // require.resolve('?')
      else if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        ts.isIdentifier(node.expression.expression) &&
        node.expression.expression.escapedText === 'require' &&
        node.expression.name.escapedText === 'resolve' &&
        ts.isStringLiteralLike(node.arguments[0])
      ) {
        importPaths.add((node.arguments[0] as ts.StringLiteralLike).text);
      }
      // require('?')
      else if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.escapedText === 'require' &&
        ts.isStringLiteralLike(node.arguments[0])
      ) {
        importPaths.add((node.arguments[0] as ts.StringLiteralLike).text);
      }

      ts.forEachChild(node, search);
    }

    search(sourceFile);
  }

  const imports: PackageJson.Dependency = {};

  for (const importPath of importPaths) {
    const packageName: string = /^@/.test(importPath)
      ? importPath.split('/').slice(0, 2).join('/')
      : importPath.split('/')[0];

    if (!imports[packageName]) {
      const internalPackage: PackageInfo | undefined = internalPackages.get(packageName);

      if (internalPackage) {
        imports[packageName] = `^${internalPackage.version}`;
      } else if (externalPackages[packageName]) {
        imports[packageName] = externalPackages[packageName];
      }
    }
  }

  return imports;
}
