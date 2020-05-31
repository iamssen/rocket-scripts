import { getPackagesEntry, getRootDependencies } from '@react-zeroconfig/packages';
import { PackageInfo } from '@react-zeroconfig/packages/rule';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import { PackageJson } from 'type-fest';

describe('getPackagesEntry()', () => {
  test('should get packages entry', async () => {
    const cwd: string = await copyTmpDirectory(process.cwd(), `test/fixtures/packages/basic`);
    const entry: Map<string, PackageInfo> = await getPackagesEntry({ cwd });
    const externalPackages: PackageJson.Dependency = await getRootDependencies({ cwd });

    expect(entry.has('a')).toBeTruthy();
    expect(entry.has('b')).toBeTruthy();
    expect(entry.has('c')).toBeTruthy();
    expect('react' in externalPackages).toBeTruthy();
  });

  test('should get packages entry by @group/*', async () => {
    const cwd: string = await copyTmpDirectory(process.cwd(), `test/fixtures/packages/group-entry`);
    const entry: Map<string, PackageInfo> = await getPackagesEntry({ cwd });
    const externalPackages: PackageJson.Dependency = await getRootDependencies({ cwd });

    expect(entry.has('@group/a')).toBeTruthy();
    expect(entry.has('@group/b')).toBeTruthy();
    expect(entry.has('@group/c')).toBeTruthy();
    expect('react' in externalPackages).toBeTruthy();
  });
});
