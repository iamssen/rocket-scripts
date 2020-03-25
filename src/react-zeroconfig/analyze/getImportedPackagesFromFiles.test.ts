import path from 'path';
import { createTmpFixture } from '../utils/createTmpFixture';
import { glob } from '../utils/glob-promise';
import { getImportedPackagesFromFiles } from './getImportedPackagesFromFiles';

async function getSources(dir: string): Promise<string[]> {
  return await glob(`${dir}/**/*.{js,jsx,mjs,ts,tsx}`, {
    ignore: ['**/public/**/*', '**/__*__/**/*', '**/*.{stories,story,test,spec}.{js,jsx,mjs,ts,tsx}'],
  });
}

describe('getImportedPackagesFromFiles', () => {
  test('Package 내의 import package들을 정상적으로 가져와야 한다', async () => {
    const cwd: string = await createTmpFixture('packages-validate');

    const aPackages: Set<string> = await getImportedPackagesFromFiles(
      await getSources(path.join(cwd, 'src/_packages/a')),
    );
    expect(Array.from(aPackages).sort()).toStrictEqual(['c', 'react', 'rxjs']);

    const bPackages: Set<string> = await getImportedPackagesFromFiles(
      await getSources(path.join(cwd, 'src/_packages/b')),
    );
    expect(Array.from(bPackages).sort()).toStrictEqual(['moment']);

    const cPackages: Set<string> = await getImportedPackagesFromFiles(
      await getSources(path.join(cwd, 'src/_packages/c')),
    );
    expect(Array.from(cPackages).sort()).toStrictEqual(['b', 'react']);
  });
});
