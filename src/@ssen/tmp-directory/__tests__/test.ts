import fs from 'fs-extra';
import path from 'path';
import { copyTmpDirectory, createTmpDirectory } from '../';

describe('tmp-directory', () => {
  test('should get a created tmp directory', async () => {
    const dir: string = await createTmpDirectory();
    expect(fs.statSync(dir).isDirectory()).toBeTruthy();
  });

  test('should get a copied tmp directory', async () => {
    const source: string = path.join(process.cwd(), 'test/fixtures/packages/basic');
    expect(fs.statSync(source).isDirectory()).toBeTruthy();

    const dir: string = await copyTmpDirectory(source);
    expect(fs.statSync(dir).isDirectory()).toBeTruthy();

    expect(fs.existsSync(path.join(dir, 'public/favicon.ico'))).toBeTruthy();
    expect(fs.existsSync(path.join(dir, 'public/manifest.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(dir, 'src/app/index.html'))).toBeTruthy();
    expect(fs.existsSync(path.join(dir, 'src/app/index.tsx'))).toBeTruthy();
    expect(fs.existsSync(path.join(dir, 'jsconfig.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(dir, 'tsconfig.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(dir, '.zeroconfig.packages.yaml'))).toBeTruthy();
  });
});
