import { PackageJson } from 'type-fest';
import { getPackagesOrder } from '../getPackagesOrder';

describe('@ssen/collect-dependencies', () => {
  describe('getPackagesOrder()', () => {
    test('should get the ordered names array', () => {
      function test(packageJsonContents: PackageJson[], matchOrderedNames: string[]) {
        const orderedNames: string[] = getPackagesOrder({ packageJsonContents });

        expect(orderedNames).toEqual(matchOrderedNames);

        orderedNames.reverse().forEach((a: string, i: number) => {
          // sorted.slice(0, i) does not have a
          for (const b of orderedNames.slice(0, i)) {
            const aFile: PackageJson | undefined = packageJsonContents.find(({ name }) => name === a);
            expect(aFile).not.toBeUndefined();
            if (aFile) {
              expect(Object.keys(aFile.dependencies || {})).not.toEqual(expect.arrayContaining([b]));
            }
          }
        });
      }

      test(
        [
          {
            name: '@lunit/insight-viewer',
            dependencies: {
              react: '>=16.8.0',
              'cornerstone-core': '^2.3.0',
              'cornerstone-wado-image-loader': '^2.2.3',
              'dicom-parser': '^1.8.3',
              rxjs: '^6.5.2',
              polylabel: '^1.0.2',
              'point-in-polygon': '^1.0.1',
              'styled-components': '>=4.3.2',
              '@material-ui/core': '^4.3.1',
              '@lunit/heatmap': '^1.0.0',
              '@lunit/is-complex-polygon': '^1.0.0',
              '@lunit/is-polygon-area-greater-than-area': '^1.0.0',
              csstype: '^2.6.7',
              '@storybook/addons': '^5.2.8',
            },
          },
          {
            name: '@lunit/heatmap',
            dependencies: {
              react: '>=16.8.0',
            },
          },
        ],
        ['@lunit/heatmap', '@lunit/insight-viewer'],
      );

      test(
        [
          {
            name: 'a',
            dependencies: {
              c: '0.0.0',
            },
          },
          {
            name: 'b',
            dependencies: {
              a: '0.0.0',
              c: '0.0.0',
            },
          },
          {
            name: 'c',
          },
          {
            name: 'd',
            dependencies: {
              e: '0.0.0',
              b: '0.0.0',
            },
          },
          {
            name: 'e',
          },
        ],
        ['e', 'c', 'a', 'b', 'd'],
      );

      test(
        [
          {
            name: '@ssen/test-module1',
            dependencies: {
              react: '0',
            },
          },
          {
            name: '@ssen/test-module2',
            dependencies: {
              react: '0',
              'test-module3': '0',
            },
          },
          {
            name: 'router-store',
            dependencies: {
              react: '0',
              'react-router': '0',
            },
          },
          {
            name: 'test-module3',
            dependencies: {
              react: '0',
              '@ssen/test-module1': '0',
            },
          },
          {
            name: 'use-react-intl',
            dependencies: {
              react: '0',
              'react-intl': '0',
            },
          },
        ],
        ['use-react-intl', '@ssen/test-module1', 'test-module3', 'router-store', '@ssen/test-module2'],
      );
    });

    test('should cause error if does not have name field in the package.json', () => {
      const packageJsonContents: PackageJson[] = [
        {
          name: '@ssen/test-module1',
          dependencies: {
            react: '0',
          },
        },
        {
          dependencies: {
            react: '0',
          },
        },
      ];

      expect(() => getPackagesOrder({ packageJsonContents })).toThrow();
    });

    test('should cause error if the dependencies are circular references', () => {
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

      expect(() => getPackagesOrder({ packageJsonContents })).toThrow();
    });
  });
});
