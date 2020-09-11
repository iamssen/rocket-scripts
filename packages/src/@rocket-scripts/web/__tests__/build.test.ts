import { build } from '@rocket-scripts/web';
import { exec, glob } from '@ssen/promised';
import { copyTmpDirectory, createTmpDirectory } from '@ssen/tmp-directory';
import path from 'path';

describe('web/build', () => {
  test.each(['start', 'webpack-config', 'css'])(
    'should build the project "fixtures/web/%s"',
    async (dir: string) => {
      // Arrange : project directories
      const cwd: string = await copyTmpDirectory(
        path.join(process.cwd(), `test/fixtures/web/${dir}`),
      );
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
        webpackConfig:
          dir === 'webpack-config' ? '{cwd}/webpack.config.js' : undefined,
      });

      // Assert
      await expect(glob(`${outDir}/manifest.json`)).resolves.toHaveLength(1);
      await expect(glob(`${outDir}/size-report.html`)).resolves.toHaveLength(1);
      await expect(glob(`${outDir}/favicon.ico`)).resolves.toHaveLength(1);
      await expect(glob(`${outDir}/index.*.js`)).resolves.toHaveLength(1);
      await expect(glob(`${outDir}/index.html`)).resolves.toHaveLength(1);
      if (dir !== 'webpack-config') {
        await expect(glob(`${outDir}/vendor.*.js`)).resolves.toHaveLength(1);
      }
    },
  );

  test('should copy static files with multiple static file directories', async () => {
    // Arrange : project directories
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), `test/fixtures/web/static-file-directories`),
    );
    const outDir: string = await createTmpDirectory();
    const staticFileDirectories: string[] = ['{cwd}/public', '{cwd}/static'];
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
    await expect(glob(`${outDir}/hello.json`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/manifest.json`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/size-report.html`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/favicon.ico`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/index.*.js`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/index.html`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/vendor.*.js`)).resolves.toHaveLength(1);
  });
});
