import path from 'path';
import { createTmpFixture } from '../utils/createTmpFixture';
import { findInternalPackageMissingDependencies } from './findInternalPackageMissingDependencies';

describe('findInternalPackageMissingDependencies', () => {
  test('입력되지 않은 package들을 가져와야 한다', async () => {
    const cwd: string = await createTmpFixture('packages-validate');
    
    const aMissingPackages: Set<string> | undefined = await findInternalPackageMissingDependencies({packageDir: path.join(cwd, 'src/_packages/a')});
    expect(Array.from(aMissingPackages || []).sort()).toStrictEqual(['rxjs']);
    
    const bMissingPackages: Set<string> | undefined = await findInternalPackageMissingDependencies({packageDir: path.join(cwd, 'src/_packages/b')});
    expect(Array.from(bMissingPackages || []).sort()).toStrictEqual(['moment']);
    
    const cMissingPackages: Set<string> | undefined = await findInternalPackageMissingDependencies({packageDir: path.join(cwd, 'src/_packages/c')});
    expect(cMissingPackages).toBeUndefined();
  });
});