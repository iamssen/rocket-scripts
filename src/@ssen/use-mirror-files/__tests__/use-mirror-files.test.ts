import { createTmpDirectory } from '@ssen/tmp-directory';
import { useMirrorFiles } from '@ssen/use-mirror-files';
import { renderHook } from '@testing-library/react-hooks';
import fs from 'fs-extra';
import path from 'path';

function waitExists(file: string, timeout: number = 1000): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const start: number = performance.now();

    function check() {
      if (fs.existsSync(file)) {
        resolve(true);
      } else if (performance.now() - start > timeout) {
        resolve(false);
      } else {
        setTimeout(check, 100);
      }
    }

    check();
  });
}

async function copy(file: string, dir: string, toDir: string) {
  const f: string = path.join(toDir, file);
  await fs.mkdirp(path.dirname(f));
  await fs.copyFile(path.join(dir, file), f);
}

describe('useMirrorFiles()', () => {
  test('should mirror static files', async () => {
    const source: string = path.join(process.cwd(), 'test/fixtures/use-mirror-files/static-files');
    const dir: string = await createTmpDirectory();
    const outDir: string = await createTmpDirectory();

    await copy('a.mp4', source, dir);
    await copy('b.jpeg', source, dir);

    expect(fs.existsSync(path.join(dir, 'a.mp4'))).toBeTruthy();
    expect(fs.existsSync(path.join(dir, 'b.jpeg'))).toBeTruthy();

    const { unmount } = renderHook(() =>
      useMirrorFiles({
        filesDirsOrGlobs: [dir],
        outDir,
        ignored: /.jpeg$/,
        onMessage: () => {},
      }),
    );

    await expect(waitExists(path.join(outDir, 'a.mp4'))).resolves.toBeTruthy();
    await expect(waitExists(path.join(outDir, 'b.jpeg'))).resolves.toBeFalsy();

    await copy('public/c.svg', source, dir);
    await expect(waitExists(path.join(outDir, 'public/c.svg'))).resolves.toBeTruthy();

    await copy('public/d.html', source, dir);
    await copy('public/e.pdf', source, dir);
    await expect(waitExists(path.join(outDir, 'public/d.html'))).resolves.toBeTruthy();
    await expect(waitExists(path.join(outDir, 'public/e.pdf'))).resolves.toBeTruthy();

    await fs.unlink(path.join(path.join(outDir, 'a.mp4')));
    await fs.unlink(path.join(path.join(outDir, 'public/c.svg')));
    await expect(waitExists(path.join(outDir, 'a.mp4'))).resolves.toBeFalsy();
    await expect(waitExists(path.join(outDir, 'b.jpeg'))).resolves.toBeFalsy();
    await expect(waitExists(path.join(outDir, 'public/c.svg'))).resolves.toBeFalsy();
    await expect(waitExists(path.join(outDir, 'public/d.html'))).resolves.toBeTruthy();
    await expect(waitExists(path.join(outDir, 'public/e.pdf'))).resolves.toBeTruthy();

    unmount();
  });
});
