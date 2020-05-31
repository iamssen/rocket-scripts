import { build } from '@react-zeroconfig/packages';
import { exec } from '@ssen/promised';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import fs from 'fs-extra';
import path from 'path';

function hasComment(file: string): boolean {
  return fs.readFileSync(file, { encoding: 'utf8' }).indexOf('/**') > -1;
}

describe('build()', () => {
  test.each(['basic', 'transform-package-json', 'transform-build'])(
    'should build packages normally with %s',
    async (dir: string) => {
      const cwd: string = await copyTmpDirectory(process.cwd(), `test/fixtures/packages/${dir}`);
      const outDir: string = path.join(cwd, 'dist/packages');

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

      switch (dir) {
        case 'basic':
          expect(hasComment(path.join(outDir, 'b/index.d.ts'))).toBeTruthy();
          break;
        case 'transform-package-json':
          expect(hasComment(path.join(outDir, 'b/index.d.ts'))).toBeTruthy();
          expect(fs.readJsonSync(path.join(outDir, 'b/package.json')).keywords).toEqual(['hello']);
          break;
        case 'transform-build':
          expect(hasComment(path.join(outDir, 'b/index.d.ts'))).toBeFalsy();
          break;
      }
    },
    100000,
  );

  test('should build grouped packages normally', async () => {
    const cwd: string = await copyTmpDirectory(process.cwd(), `test/fixtures/packages/group-entry`);
    const outDir: string = path.join(cwd, 'dist/packages');

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

    expect(fs.existsSync(path.join(outDir, 'group__a/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'group__a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'group__a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'group__a/package.json'))).toBeTruthy();

    expect(fs.existsSync(path.join(outDir, 'group__b/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'group__b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'group__b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'group__b/package.json'))).toBeTruthy();

    expect(fs.existsSync(path.join(outDir, 'group__c/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'group__a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'group__c/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'group__c/package.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(outDir, 'group__c/public/test.txt'))).toBeTruthy();
  }, 100000);
});
