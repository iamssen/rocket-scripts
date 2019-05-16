import path from 'path';
import { createTmpFixture } from '../utils/createTmpFixture';
import { getInternalPackagePublicDrectories } from './getInternalPackagePublicDrectories';

describe('getInternalPackagePublicDirectories()', () => {
  test('public 디렉토리가 포함된 packages entry를 가져온다', async () => {
    const cwd: string = await createTmpFixture('packages');
    
    await expect(getInternalPackagePublicDrectories({packageDir: path.join(cwd, 'src/_packages')})).resolves.toEqual([
      path.join(cwd, 'src/_packages/c/public'),
    ]);
  });
});