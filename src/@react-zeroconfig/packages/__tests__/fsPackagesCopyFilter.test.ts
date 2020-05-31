import { fsPackagesCopyFilter } from '@react-zeroconfig/packages';
import path from 'path';

describe('fsPackagesCopyFilter()', () => {
  test.each([
    '__tests__/a/b/c.png',
    '__fixtures__/a/b/c.png',
    '__foo__/a/b/c.png',
    '__xxx__/a/b/c.png',
    'a/b/c.ts',
    'a/b/c.tsx',
    'a/b/c.js',
    'a/b/c.jsx',
    'a/b/c/.package.json.ts',
    'a/b/c/.package.json.js',
    'a/b/c/.build.ts',
    'a/b/c/.build.js',
    '__tests__/a.d.ts',
    'public/__xxx__/a/b/c.png',
  ])('should ignore file pattern %s', (pattern: string) => {
    expect(fsPackagesCopyFilter(path.join('/Users/foo/bar', pattern))).toBeFalsy();
    expect(fsPackagesCopyFilter(path.win32.join('C:/foo/bar', pattern))).toBeFalsy();
  });

  test.each([
    'a/b/c.d.ts',
    'a/public/c.ts',
    'a/public/c.tsx',
    'a/public/c.js',
    'a/public/c.jsx',
    'a/public/.package.json.ts',
    'a/public/.package.json.js',
    'a/public/.build.ts',
    'a/public/.build.js',
    'a/bin/test.js',
    'a/bin/zeroconfig',
    'a/bin/zeroconfig.js',
    'a/bin/trism',
    'a/bin/trism.js',
  ])('should pass file pattern %s', (pattern: string) => {
    expect(fsPackagesCopyFilter(path.join('/Users/foo/bar', pattern))).toBeTruthy();
    expect(fsPackagesCopyFilter(path.win32.join('C:/foo/bar', pattern))).toBeTruthy();
  });
});
