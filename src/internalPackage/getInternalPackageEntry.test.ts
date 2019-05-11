import { createTmpMockup } from '../utils/createTmpMockup';
import { getInternalPackageEntry } from './getInternalPackageEntry';
import path from 'path';

describe('getInternalPackageEntry()', () => {
  test('get entry', async () => {
    const dirpath: string = await createTmpMockup('basic');
    
    await expect(getInternalPackageEntry({packageDir: path.join(dirpath, 'src/_packages')})).resolves.toEqual(['a', 'b', 'c']);
  });
  
  test('no packages', async () => {
    const dirpath: string = await createTmpMockup('no-packages');
    
    await expect(getInternalPackageEntry({packageDir: path.join(dirpath, 'src/_packages')})).resolves.toEqual([]);
  });
});