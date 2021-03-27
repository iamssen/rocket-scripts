import { watch } from '@rocket-scripts/web';
import { copyFixture } from '@ssen/copy-fixture';
import { createInkWriteStream } from '@ssen/ink-helpers';
import { glob } from '@ssen/promised';
import { createTmpDirectory } from '@ssen/tmp-directory';

const timeout = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

describe('web/watch', () => {
  test.each(['start', 'webpack-config', 'css'])(
    'should build the project "fixtures/web/%s"',
    async (dir: string) => {
      // Arrange : project directories
      const cwd: string = await copyFixture(`test/fixtures/web/${dir}`);
      const outDir: string = await createTmpDirectory();
      const staticFileDirectories: string[] = ['{cwd}/public'];
      const app: string = 'app';

      // Arrange : stdout
      const stdout = createInkWriteStream();

      // Act
      const { close } = await watch({
        cwd,
        staticFileDirectories,
        app,
        stdout,
        outDir,
        webpackConfig:
          dir === 'webpack-config' ? '{cwd}/webpack.config.js' : undefined,
      });

      await timeout(1000 * 5);

      // Assert
      console.log(await glob(`${outDir}/*`));
      await expect(glob(`${outDir}/manifest.json`)).resolves.toHaveLength(1);
      await expect(glob(`${outDir}/favicon.ico`)).resolves.toHaveLength(1);
      await expect(glob(`${outDir}/index.js`)).resolves.toHaveLength(1);
      await expect(glob(`${outDir}/index.html`)).resolves.toHaveLength(1);

      // Exit
      await close();

      console.log(stdout.lastFrame());
    },
  );

  test('should create an isolated script', async () => {
    // Arrange : project directories
    const cwd: string = await copyFixture(`test/fixtures/web/isolated-scripts`);
    const outDir: string = await createTmpDirectory();
    const staticFileDirectories: string[] = ['{cwd}/public'];
    const app: string = 'app';

    // Arrange : stdout
    const stdout = createInkWriteStream();

    // Act
    const { close } = await watch({
      cwd,
      staticFileDirectories,
      app,
      outDir,
      isolatedScripts: {
        isolate: 'isolate.ts',
      },
    });

    await timeout(1000 * 5);

    // Assert
    console.log(await glob(`${outDir}/*`));
    await expect(glob(`${outDir}/manifest.json`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/favicon.ico`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/index.js`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/index.html`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/isolate.js`)).resolves.toHaveLength(1);

    // Exit
    await close();

    console.log(stdout.lastFrame());
  });

  test('should copy static files with multiple static file directories', async () => {
    // Arrange : project directories
    const cwd: string = await copyFixture(
      `test/fixtures/web/static-file-directories`,
    );
    const outDir: string = await createTmpDirectory();
    const staticFileDirectories: string[] = ['{cwd}/public', '{cwd}/static'];
    const app: string = 'app';

    // Arrange : stdout
    const stdout = createInkWriteStream();

    // Act
    const { close } = await watch({
      cwd,
      staticFileDirectories,
      app,
      outDir,
    });

    await timeout(1000 * 5);

    // Assert
    console.log(await glob(`${outDir}/*`));
    await expect(glob(`${outDir}/manifest.json`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/favicon.ico`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/index.js`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/index.html`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/hello.json`)).resolves.toHaveLength(1);

    // Exit
    await close();

    console.log(stdout.lastFrame());
  });
});
