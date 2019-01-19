import path = require('path');

describe('createConfig', () => {
  it('Should be matched module directories locations and module names', () => {
    const moduleDirectories: string[] = [
      '/Test/src/_modules/@ssen/test-module1',
      '/Test/src/_modules/@ssen/test-module2',
      '/Test/src/_modules/test-module3',
      '/Test/src/_modules/test-module4',
      '/Test/src/_modules/@xxx/ddd/eee/test-module8',
      '/Test/src/_modules/@test/test-module5',
    ];
    
    const moduleRoot: string = '/Test/src/_modules';
    
    const dirModuleNames: string[] = moduleDirectories
      .map(dirname => path.relative(moduleRoot, dirname).split(path.sep))
      .filter(dirnamePaths => dirnamePaths.length < 3)
      .map(dirnamePaths => dirnamePaths.join('/'));
    
    expect(dirModuleNames).toEqual([
      '@ssen/test-module1',
      '@ssen/test-module2',
      'test-module3',
      'test-module4',
      '@test/test-module5',
    ]);
  });
});