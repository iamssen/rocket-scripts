import path from 'path';
import { createTmpFixture } from '../utils/createTmpFixture';
import { getInternalPackageEntry } from './getInternalPackageEntry';

describe('getInternalPackageEntry()', () => {
  test('src/_packages 디렉토리의 entry를 가져온다', async () => {
    const cwd: string = await createTmpFixture('packages');
    
    expect(getInternalPackageEntry({packageDir: path.join(cwd, 'src/_packages')})).toEqual(expect.arrayContaining(['a', 'b', 'c']));
  });
  
  test('src/_packages 디렉토리의 entry를 가져온다 (@group 포함)', async () => {
    const cwd: string = await createTmpFixture('packages-group');
    
    expect(getInternalPackageEntry({packageDir: path.join(cwd, 'src/_packages')})).toEqual(expect.arrayContaining(['a', '@group/b', '@group/c']));
  });
  
  test('src/_package가 없는 경우 비어있는 entry를 가져온다', async () => {
    const cwd: string = await createTmpFixture('simple-csr-js');
    
    expect(getInternalPackageEntry({packageDir: path.join(cwd, 'src/_packages')})).toEqual([]);
  });
});