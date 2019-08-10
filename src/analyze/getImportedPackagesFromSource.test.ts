import { getImportedPackagesFromSource } from './getImportedPackagesFromSource';

describe('getImportedPackagesFromSource', () => {
  test('절대 경로로 된 모든 package들을 읽어낸다', () => {
    const source: string = `
      import x from 'x';
      import y from 'y';
      import z from './z';
      import a from '@group/a';
      import b from '../b';
      
      import y1 from 'y/a/b';
      import y2 from 'y/a/c';
    `;
    
    expect(getImportedPackagesFromSource(source).sort()).toEqual(['@group/a', 'x', 'y']);
  });
});