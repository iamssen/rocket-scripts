import path from 'path';
import { createTmpFixture } from '../utils/createTmpFixture';
import { getInternalPackagePublicDrectories } from './getInternalPackagePublicDrectories';

describe('getInternalPackagePublicDirectories()', () => {
  test('src/_packages 에서 public directory들의 path를 가져온다', async () => {
    const cwd: string = await createTmpFixture('packages');
    
    await expect(getInternalPackagePublicDrectories({packageDir: path.join(cwd, 'src/_packages')})).resolves.toEqual([
      path.join(cwd, 'src/_packages/c/public'),
    ]);
  });
  
  test('src/_packages 에서 public directory들의 path를 가져온다 (@group 포함)', async () => {
    const cwd: string = await createTmpFixture('packages-group');
    
    await expect(getInternalPackagePublicDrectories({packageDir: path.join(cwd, 'src/_packages')})).resolves.toEqual([
      path.join(cwd, 'src/_packages/@group/c/public'),
    ]);
  });
  
  test('src/_packages 가 없는 경우 빈 array를 가져온다', async () => {
    const cwd: string = await createTmpFixture('simple-csr-ts');
    
    await expect(getInternalPackagePublicDrectories({packageDir: path.join(cwd, 'src/_packages')})).resolves.toEqual([]);
  });
});