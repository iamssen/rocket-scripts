import sortPackageJsonFiles from './sortPackageJsonFiles';

type JsonFile = {name: string, dependencies?: {[name: string]: string}};

describe('sortPackageJsonFiles', () => {
  it('Should be sorted modules by their dependencies', () => {
    const jsonFiles: JsonFile[] = [
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
    ];
    
    const sorted: string[] = sortPackageJsonFiles(jsonFiles).reverse();
    
    sorted.forEach((a, i) => {
      for (const b of sorted.slice(0, i)) {
        const aFile: JsonFile | undefined = jsonFiles.find(jsonFile => jsonFile.name === a);
        expect(aFile).not.toBeUndefined();
        if (aFile) {
          expect(!aFile.dependencies || !aFile.dependencies[b]).toBeTruthy();
        }
      }
    });
  });
});