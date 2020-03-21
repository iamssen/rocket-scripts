import path from 'path';
import { createTmpFixture } from '../utils/createTmpFixture';
import { getStaticFileDirectories } from './getStaticFileDirectories';

describe('getStaticFileDirectories()', () => {
  test('staticFileDirectories를 직접 입력했을때 public을 가져옴', async () => {
    const cwd: string = await createTmpFixture('packages');
    const staticFileDirectories: string[] = await getStaticFileDirectories({
      staticFileDirectories: 'src/_packages/c/public',
      cwd,
    });

    expect(staticFileDirectories).toEqual([path.join(cwd, 'src/_packages/c/public')]);
  });

  test('staticFileDirectories를 입력하지 않았을때 static 디렉토리를 자동으로 가져옴', async () => {
    const cwd: string = await createTmpFixture('packages');

    await expect(getStaticFileDirectories({ cwd })).resolves.toEqual([
      path.join(cwd, 'public'),
      path.join(cwd, 'src/_packages/c/public'),
    ]);
  });

  test('staticFilePackages를 입력했을때 public을 가져옴', async () => {
    const cwd: string = await createTmpFixture('mock-modules');

    await expect(getStaticFileDirectories({ staticFilePackages: 'x y', cwd })).resolves.toEqual([
      path.join(cwd, 'public'),
      path.join(cwd, 'src/_packages/c/public'),
      //path.join(cwd, 'node_modules/x/public'), // x/public 디렉토리가 없음
      path.join(cwd, 'node_modules/y/public'),
    ]);
  });
});
