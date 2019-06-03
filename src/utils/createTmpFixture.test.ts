import fs from 'fs-extra';
import path from 'path';
import { createTmpFixture } from './createTmpFixture';
import { glob } from './glob-promise';

describe('createTmpFixture', () => {
  test('Fixture를 정상적으로 Tmp 디렉토리에 복사한다', async () => {
    const cwd: string = await createTmpFixture('mock-modules');
    expect(await fs.pathExists(cwd)).toBeTruthy();
    
    expect(await glob(`${cwd}/src/_packages/**/package.json`)).toEqual(expect.arrayContaining([
      path.join(cwd, 'src/_packages/a/package.json'),
      path.join(cwd, 'src/_packages/b/package.json'),
      path.join(cwd, 'src/_packages/c/package.json'),
    ]));
  });
});