import { PackageJson } from 'type-fest';
import { getPackageJsonContentsOrderedNames } from './getPackageJsonContentsOrderedNames';

describe('getPackageJsonContentsOrderedNames', () => {
  test('기본 package.json 정보 사용해서 ordered names를 얻음', () => {
    function test(packageJsonContents: PackageJson[], matchOrderedNames: string[]) {
      const orderedNames: string[] = getPackageJsonContentsOrderedNames({packageJsonContents});
      
      expect(orderedNames).toEqual(matchOrderedNames);
      
      orderedNames.reverse().forEach((a: string, i: number) => {
        // sorted.slice(0, i) does not have a
        for (const b of orderedNames.slice(0, i)) {
          const aFile: PackageJson | undefined = packageJsonContents.find(({name}) => name === a);
          expect(aFile).not.toBeUndefined();
          if (aFile) {
            expect(Object.keys(aFile.dependencies || {})).not.toEqual(expect.arrayContaining([b]));
          }
        }
      });
    }
    
    test([
      {
        name: 'a',
        dependencies: {
          'c': '0.0.0',
        },
      },
      {
        name: 'b',
        dependencies: {
          'a': '0.0.0',
          'c': '0.0.0',
        },
      },
      {
        name: 'c',
      },
      {
        name: 'd',
        dependencies: {
          'e': '0.0.0',
          'b': '0.0.0',
        },
      },
      {
        name: 'e',
      },
    ], [
      'e',
      'c',
      'a',
      'b',
      'd',
    ]);
    
    test([
      {
        name: '@ssen/test-module1',
        dependencies: {
          'react': '0',
        },
      },
      {
        name: '@ssen/test-module2',
        dependencies: {
          'react': '0',
          'test-module3': '0',
        },
      },
      {
        name: 'router-store',
        dependencies: {
          'react': '0',
          'react-router': '0',
        },
      },
      {
        name: 'test-module3',
        dependencies: {
          'react': '0',
          '@ssen/test-module1': '0',
        },
      },
      {
        name: 'use-react-intl',
        dependencies: {
          'react': '0',
          'react-intl': '0',
        },
      },
    ], [
      'use-react-intl',
      'router-store',
      '@ssen/test-module1',
      'test-module3',
      '@ssen/test-module2',
    ]);
  });
  
  test('package.json에 name이 없으면 Error가 발생한다', () => {
    const packageJsonContents: PackageJson[] = [
      {
        name: '@ssen/test-module1',
        dependencies: {
          'react': '0',
        },
      },
      {
        dependencies: {
          'react': '0',
        },
      },
    ];
    
    expect(() => getPackageJsonContentsOrderedNames({packageJsonContents})).toThrow();
  });
  
  test('package.json dependencies가 순환참조되면 Error가 발생한다', () => {
    const packageJsonContents: PackageJson[] = [
      {
        name: '@ssen/test-module1',
        dependencies: {
          '@ssen/test-module2': '0',
        },
      },
      {
        name: '@ssen/test-module2',
        dependencies: {
          '@ssen/test-module1': '0',
        },
      },
    ];
    
    expect(() => getPackageJsonContentsOrderedNames({packageJsonContents})).toThrow();
  });
});