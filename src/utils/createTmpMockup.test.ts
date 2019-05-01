import fs from 'fs-extra';
import path from 'path';
import { createTmpMockup } from './createTmpMockup';
import { glob } from './glob-promise';

describe('createTmpMockup', () => {
  test('create mockup', async () => {
    const dirpath: string = await createTmpMockup('basic');
    expect(await fs.pathExists(dirpath)).toBeTruthy();
    
    expect(await glob(`${dirpath}/src/_packages/**/package.json`)).toEqual([
      path.join(dirpath, 'src/_packages/a/package.json'),
      path.join(dirpath, 'src/_packages/b/package.json'),
      path.join(dirpath, 'src/_packages/c/package.json'),
    ]);
  });
});