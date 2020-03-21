import path from 'path';
import { getInternalPackageEntry } from '../internalPackage/getInternalPackageEntry';
import { createTmpFixture } from '../utils/createTmpFixture';
import { createPackageBuildOptions } from './createPackageBuildOptions';

describe('createPackageBuildOptions', () => {
  test('기본 BuildOptions를 생성한다', async () => {
    const cwd: string = await createTmpFixture('packages');
    const entry: string[] = getInternalPackageEntry({ packageDir: path.join(cwd, 'src/_packages') });

    await expect(createPackageBuildOptions({ entry, cwd })).resolves.toEqual([
      {
        name: 'b',
        file: path.join(cwd, 'src/_packages/b/index.ts'),
        buildTypescriptDeclaration: true,
        externals: [],
      },
      {
        name: 'c',
        file: path.join(cwd, 'src/_packages/c/index.tsx'),
        buildTypescriptDeclaration: true,
        externals: ['b'],
      },
      {
        name: 'a',
        file: path.join(cwd, 'src/_packages/a/index.jsx'),
        buildTypescriptDeclaration: false,
        externals: ['b', 'c'],
      },
    ]);
  });

  test('기본 BuildOptions를 생성한다 (@group)', async () => {
    const cwd: string = await createTmpFixture('packages-group');
    const entry: string[] = getInternalPackageEntry({ packageDir: path.join(cwd, 'src/_packages') });

    await expect(createPackageBuildOptions({ entry, cwd })).resolves.toEqual([
      {
        name: '@group/b',
        file: path.join(cwd, 'src/_packages/@group/b/index.ts'),
        buildTypescriptDeclaration: true,
        externals: [],
      },
      {
        name: '@group/c',
        file: path.join(cwd, 'src/_packages/@group/c/index.tsx'),
        buildTypescriptDeclaration: true,
        externals: ['@group/b'],
      },
      {
        name: 'a',
        file: path.join(cwd, 'src/_packages/a/index.jsx'),
        buildTypescriptDeclaration: false,
        externals: ['@group/b', '@group/c'],
      },
    ]);
  });

  test('index 파일이 없으면 Error를 발생시킨다', async () => {
    const cwd: string = await createTmpFixture('packages-no-index');
    const entry: string[] = getInternalPackageEntry({ packageDir: path.join(cwd, 'src/_packages') });

    await expect(createPackageBuildOptions({ entry, cwd })).rejects.toThrow();
  });

  test('index 파일이 여러개면 Error를 발생시킨다', async () => {
    const cwd: string = await createTmpFixture('packages-multi-index');
    const entry: string[] = getInternalPackageEntry({ packageDir: path.join(cwd, 'src/_packages') });

    await expect(createPackageBuildOptions({ entry, cwd })).rejects.toThrow();
  });
});
