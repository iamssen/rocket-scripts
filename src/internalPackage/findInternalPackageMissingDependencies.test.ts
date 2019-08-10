import path from 'path';
import { createTmpFixture } from '../utils/createTmpFixture';
import { findInternalPackageMissingDependencies } from './findInternalPackageMissingDependencies';

describe('findInternalPackageMissingDependencies', () => {
  test('입력되지 않은 package들을 가져와야 한다', async () => {
    const cwd: string = await createTmpFixture('packages-validate');
    
    const aMissingPackages: string[] = await findInternalPackageMissingDependencies({packageDir: path.join(cwd, 'src/_packages/a')});
    expect(aMissingPackages.sort()).toStrictEqual(['rxjs']);
    
    const bMissingPackages: string[] = await findInternalPackageMissingDependencies({packageDir: path.join(cwd, 'src/_packages/b')});
    expect(bMissingPackages.sort()).toStrictEqual(['moment']);
    
    const cMissingPackages: string[] = await findInternalPackageMissingDependencies({packageDir: path.join(cwd, 'src/_packages/c')});
    expect(cMissingPackages.sort()).toStrictEqual([]);
  });
});