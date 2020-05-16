import { getDependencies } from '@react-zeroconfig/core';
import { build, getPackagesEntry } from '@react-zeroconfig/packages';
import { exec } from '@ssen/promised';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';
import { PackageInfo } from '../types';

describe('@react-zeroconfig/packages', () => {
  describe('build()', () => {
    test('...', async () => {
      const cwd: string = await copyTmpDirectory(process.cwd(), 'test/fixtures/v4-packages');
      const entry: Map<string, PackageInfo> = await getPackagesEntry({ cwd });
      const externalPackages: PackageJson.Dependency = await getDependencies({ cwd });
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
  });
});
