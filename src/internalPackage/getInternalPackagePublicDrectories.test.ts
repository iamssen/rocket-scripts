import { createTmpMockup } from '../utils/createTmpMockup';
import { getInternalPackagePublicDrectories } from './getInternalPackagePublicDrectories';
import path from 'path';

describe('getInternalPackagePublicDirectories()', () => {
  test('get internal package directories', async () => {
    const dirpath: string = await createTmpMockup('basic');
    
    await expect(getInternalPackagePublicDrectories({packageDir: path.join(dirpath, 'src/_packages')})).resolves.toEqual([
      path.join(dirpath, 'src/_packages/c/public'),
    ]);
  });
});