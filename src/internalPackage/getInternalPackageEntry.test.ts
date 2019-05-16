import path from 'path';
import { createTmpFixture } from '../utils/createTmpFixture';
import { getInternalPackageEntry } from './getInternalPackageEntry';

describe('getInternalPackageEntry()', () => {
  test('_packages 디렉토리의 entry를 가져온다', async () => {
    const cwd: string = await createTmpFixture('packages');
    
    await expect(getInternalPackageEntry({packageDir: path.join(cwd, 'src/_packages')})).resolves.toEqual(expect.arrayContaining(['a', 'b', 'c']));
  });
  
  test('group package가 포함된 _packages 디렉토리의 entry를 가져온다', async () => {
    const cwd: string = await createTmpFixture('packages-group');
    
    await expect(getInternalPackageEntry({packageDir: path.join(cwd, 'src/_packages')})).resolves.toEqual(expect.arrayContaining(['a', '@group/b', '@group/c']));
  });
  
  test('빈 _package 디렉토리는 빈 array entry를 가져온다', async () => {
    const cwd: string = await createTmpFixture('simple-csr-js');
    
    await expect(getInternalPackageEntry({packageDir: path.join(cwd, 'src/_packages')})).resolves.toEqual([]);
  });
});