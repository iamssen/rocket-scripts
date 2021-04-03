import { build } from '@rocket-scripts/web';
import { copyFixture } from '@ssen/copy-fixture';
import { glob } from '@ssen/promised';
import { createTmpDirectory } from '@ssen/tmp-directory';

describe('web/build', () => {
  test.each(['start', 'webpack-config', 'css'])(
    'should build the project "fixtures/web/%s"',
    async (dir: string) => {
      // Arrange : project directories
      const cwd: string = await copyFixture(`test/fixtures/web/${dir}`);
      const outDir: string = await createTmpDirectory();
      const staticFileDirectories: string[] = ['{cwd}/public'];
      const app: string = 'app';

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

  test('should create the bundle svg file', async () => {
    // Arrange : project directories
    const cwd: string = await copyFixture(`test/fixtures/web/bundle`);
    const outDir: string = await createTmpDirectory();
    const staticFileDirectories: string[] = ['{cwd}/public'];
    const app: string = 'app';

    // Act
    await build({
      cwd,
      staticFileDirectories,
      app,
      outDir,
    });

    // Assert
    await expect(glob(`${outDir}/manifest.json`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/size-report.html`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/favicon.ico`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/index.*.js`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/index.html`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/test.*.svg`)).resolves.toHaveLength(1);
  });

  test('should create an isolated script', async () => {
    // Arrange : project directories
    const cwd: string = await copyFixture(`test/fixtures/web/isolated-scripts`);
    const outDir: string = await createTmpDirectory();
    const staticFileDirectories: string[] = ['{cwd}/public'];
    const app: string = 'app';

    // Act
    await build({
      cwd,
      staticFileDirectories,
      app,
      outDir,
      isolatedScripts: {
        isolate: 'isolate.ts',
      },
    });

    // Assert
    await expect(glob(`${outDir}/manifest.json`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/size-report.html`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/favicon.ico`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/index.*.js`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/index.html`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/isolate.js`)).resolves.toHaveLength(1);
  });

  test('should copy static files with multiple static file directories', async () => {
    // Arrange : project directories
    const cwd: string = await copyFixture(
      `test/fixtures/web/static-file-directories`,
    );
    const outDir: string = await createTmpDirectory();
    const staticFileDirectories: string[] = ['{cwd}/public', '{cwd}/static'];
    const app: string = 'app';

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
