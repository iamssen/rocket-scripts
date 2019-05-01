import { createTmpMockup } from '../utils/createTmpMockup';
import { getInternalPackageEntry } from './getInternalPackageEntry';

describe('getInternalPackageEntry()', () => {
  test('get entry', async () => {
    const dirpath: string = await createTmpMockup('basic');
    
    await expect(getInternalPackageEntry({cwd: dirpath})).resolves.toEqual(['a', 'b', 'c']);
  });
  
  test('no packages', async () => {
    const dirpath: string = await createTmpMockup('no-packages');
    
    await expect(getInternalPackageEntry({cwd: dirpath})).resolves.toEqual([]);
  });
});