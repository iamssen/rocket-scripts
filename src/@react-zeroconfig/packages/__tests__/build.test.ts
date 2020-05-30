import { build, getPackagesEntry, getRootDependencies, PackageInfo } from '@react-zeroconfig/packages';
import { exec } from '@ssen/promised';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';

function hasComment(file: string): boolean {
  return fs.readFileSync(file, { encoding: 'utf8' }).indexOf('/**') > -1;
}

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
      onMessage: async (message) => {
        switch (message.type) {
          case 'error':
            throw new Error(message.errors.join('\n'));
        }
      },
    });

    expect(fs.existsSync(path.join(outDir, 'a/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'a/package.json'))).toBeTruthy();

    expect(fs.existsSync(path.join(outDir, 'b/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'b/package.json'))).toBeTruthy();

    expect(fs.existsSync(path.join(outDir, 'c/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'c/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'c/package.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'c/public/test.txt'))).toBeTruthy();

    expect(hasComment(path.join(outDir, 'b/index.d.ts'))).toBeTruthy();
  }, 100000);

  test('should build packages with a .package.json.ts config file', async () => {
    const cwd: string = await copyTmpDirectory(process.cwd(), 'test/fixtures/packages/transform-package-json');
    const entry: Map<string, PackageInfo> = await getPackagesEntry({ cwd });
    const externalPackages: PackageJson.Dependency = await getRootDependencies({ cwd });
    const outDir: string = path.join(cwd, 'dist/packages');

    expect(entry.has('a')).toBeTruthy();
    expect(entry.has('b')).toBeTruthy();
    expect(entry.has('c')).toBeTruthy();
    expect('react' in externalPackages).toBeTruthy();

    await exec(`npm install`, { cwd });
    await exec(`open ${cwd}`);

    await build({
      cwd,
      outDir,
      onMessage: async (message) => {
        switch (message.type) {
          case 'error':
            throw new Error(message.errors.join('\n'));
        }
      },
    });

    expect(fs.existsSync(path.join(outDir, 'a/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'a/package.json'))).toBeTruthy();

    expect(fs.existsSync(path.join(outDir, 'b/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'b/package.json'))).toBeTruthy();

    expect(fs.existsSync(path.join(outDir, 'c/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'c/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'c/package.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'c/public/test.txt'))).toBeTruthy();

    expect(hasComment(path.join(outDir, 'b/index.d.ts'))).toBeTruthy();

    expect(fs.readJsonSync(path.join(outDir, 'b/package.json')).keywords).toEqual(['hello']);
  }, 100000);

  test('should build packages with a .build.ts config file', async () => {
    const cwd: string = await copyTmpDirectory(process.cwd(), 'test/fixtures/packages/transform-build');
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
      onMessage: async (message) => {
        switch (message.type) {
          case 'error':
            throw new Error(message.errors.join('\n'));
        }
      },
    });

    expect(fs.existsSync(path.join(outDir, 'a/.build.js'))).toBeFalsy();
    expect(fs.existsSync(path.join(outDir, 'b/.build.ts'))).toBeFalsy();

    expect(fs.existsSync(path.join(outDir, 'a/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'a/package.json'))).toBeTruthy();

    expect(fs.existsSync(path.join(outDir, 'b/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'b/package.json'))).toBeTruthy();

    expect(fs.existsSync(path.join(outDir, 'c/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'c/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'c/package.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'c/public/test.txt'))).toBeTruthy();

    expect(hasComment(path.join(outDir, 'b/index.d.ts'))).toBeFalsy();
  }, 100000);
});
