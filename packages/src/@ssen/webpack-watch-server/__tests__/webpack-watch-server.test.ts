import { copyFixture } from '@ssen/copy-fixture';
import { createInkWriteStream } from '@ssen/ink-helpers';
import { glob } from '@ssen/promised';
import { devServerStart } from '@ssen/webpack-watch-server';
import path from 'path';

describe('webpack-watch-server', () => {
  test('should create files', async () => {
    // Arrange : project directories
    const cwd: string = await copyFixture(
      'test/fixtures/webpack-dev-server/basic',
    );
    const outDir = path.join(cwd, 'dist');
    const staticFileDirectories = [path.join(cwd, 'public')];

    const {
      devServer: devServerConfig,
      ...webpackConfig
    } = require(`${cwd}/webpack.config.js`);

    // Arrange : stdout
    const stdout = createInkWriteStream();

    // Act : server start
    const close = await devServerStart({
      cwd,
      header: '\nBASIC SAMPLE!!!\n',
      outDir,
      staticFileDirectories,
      webpackConfigs: [webpackConfig],
      stdout,
      logfile: process.env.CI
        ? path.join(process.cwd(), `logs/webpack-dev-server.txt`)
        : undefined,
    });

    // Assert
    await expect(glob(`${outDir}/manifest.json`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/favicon.ico`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/index.html`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/index.js`)).resolves.toHaveLength(1);

    // Exit
    await close();

    console.log(stdout.lastFrame());
  });

  test('should create multiple files', async () => {
    // Arrange : project directories
    const cwd: string = await copyFixture(
      'test/fixtures/webpack-dev-server/multi',
    );
    const outDir: string = path.join(cwd, 'dist');
    const staticFileDirectories = [path.join(cwd, 'public')];

    const {
      devServer: devServerConfig,
      ...indexWebpackConfig
    } = require(`${cwd}/index.webpack.config.js`);

    const anotherWebpackConfig = require(`${cwd}/another.webpack.config.js`);

    // Arrange : stdout
    const stdout = createInkWriteStream();

    // Act : server start
    const close = await devServerStart({
      cwd,
      header: '\nBASIC SAMPLE!!!\n',
      outDir,
      staticFileDirectories,
      webpackConfigs: [indexWebpackConfig, anotherWebpackConfig],
      stdout,
      logfile: process.env.CI
        ? path.join(process.cwd(), `logs/webpack-dev-server.txt`)
        : undefined,
    });

    // Assert
    await expect(glob(`${outDir}/manifest.json`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/favicon.ico`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/index.html`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/index.js`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/another.html`)).resolves.toHaveLength(1);
    await expect(glob(`${outDir}/another.js`)).resolves.toHaveLength(1);

    // Exit
    await close();

    console.log(stdout.lastFrame());
  });
});
