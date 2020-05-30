import { build, getPackagesEntry, getRootDependencies, PackageInfo } from '@react-zeroconfig/packages';
import { exec } from '@ssen/promised';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';

describe('build()', () => {
  test('should build packages normally', async () => {
    const cwd: string = await copyTmpDirectory(process.cwd(), 'test/fixtures/packages/basic');
    const entry: Map<string, PackageInfo> = await getPackagesEntry({ cwd });
    const externalPackages: PackageJson.Dependency = await getRootDependencies({ cwd });
    const outDir: string = path.join(cwd, 'dist/packages');

    expect(entry.has('a')).toBeTruthy();
    expect(entry.has('b')).toBeTruthy();
    expect(entry.has('c')).toBeTruthy();
    expect('react' in externalPackages).toBeTruthy();

    await exec(`npm install`, { cwd });
    //await exec(`open ${cwd}`);

    await build({
      cwd,
      outDir,
      onMessage: (message) => {
        switch (message.type) {
          case 'error':
            throw new Error(message.errors.join('\n'));
        }
      },
    });

    expect(fs.existsSync(path.join(outDir, 'dist/packages/a/README.md')));
    expect(fs.existsSync(path.join(outDir, 'dist/packages/a/index.js')));
    expect(fs.existsSync(path.join(outDir, 'dist/packages/a/index.d.ts')));
    expect(fs.existsSync(path.join(outDir, 'dist/packages/a/package.json')));

    expect(fs.existsSync(path.join(outDir, 'dist/packages/b/README.md')));
    expect(fs.existsSync(path.join(outDir, 'dist/packages/b/index.js')));
    expect(fs.existsSync(path.join(outDir, 'dist/packages/b/index.d.ts')));
    expect(fs.existsSync(path.join(outDir, 'dist/packages/b/package.json')));

    expect(fs.existsSync(path.join(outDir, 'dist/packages/c/README.md')));
    expect(fs.existsSync(path.join(outDir, 'dist/packages/a/index.js')));
    expect(fs.existsSync(path.join(outDir, 'dist/packages/c/index.d.ts')));
    expect(fs.existsSync(path.join(outDir, 'dist/packages/c/package.json')));
    expect(fs.existsSync(path.join(outDir, 'dist/packages/c/public/test.txt')));
  }, 100000);

  test.todo('should build packages with a .package.json.ts config file');
  test.todo('should build packages with a .build.ts config file');
});
