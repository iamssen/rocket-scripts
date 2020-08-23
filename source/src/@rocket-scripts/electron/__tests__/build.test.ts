import { build } from '@rocket-scripts/electron';
import { exec, glob } from '@ssen/promised';
import { copyTmpDirectory, createTmpDirectory } from '@ssen/tmp-directory';
import path from 'path';

describe('electron/build', () => {
  test.each(['start'])('should build the project "fixtures/electron/%s', async (dir: string) => {
    // Arrange : project directories
    const cwd: string = await copyTmpDirectory(path.join(process.cwd(), `test/fixtures/electron/${dir}`));
    const outDir: string = await createTmpDirectory();
    const staticFileDirectories: string[] = ['{cwd}/public'];
    const app: string = 'app';

    await exec(`yarn`, { cwd });

    // Act
    await build({
      cwd,
      staticFileDirectories,
      app,
      outDir,
    });

    // Assert
    await expect(glob(`${outDir}/manifest.json`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/favicon.ico`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/main.js`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/preload.js`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/renderer.js`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/index.html`)).resolves.toHaveLength(1);
  });
});
