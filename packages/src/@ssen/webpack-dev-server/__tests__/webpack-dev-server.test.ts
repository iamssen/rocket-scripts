import { copyFixture } from '@ssen/copy-fixture';
import { createInkWriteStream } from '@ssen/ink-helpers';
import { devServerStart } from '@ssen/webpack-dev-server';
import { format } from 'date-fns';
import path from 'path';
import { getPortPromise } from 'portfinder';
import puppeteer, { Browser, Page } from 'puppeteer';

const timeout = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

describe('webpack-dev-server', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: {
        width: 1200,
        height: 900,
      },
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  afterEach(async () => {
    if (page && !page.isClosed()) {
      await page.close();
    }
  });

  test('should read text', async () => {
    // Arrange : project directories
    const cwd: string = await copyFixture(
      'test/fixtures/webpack-dev-server/basic',
    );

    const port: number = await getPortPromise();

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
      port,
      hostname: 'localhost',
      webpackConfig,
      devServerConfig,
      stdout,
      logfile: process.env.CI
        ? path.join(process.cwd(), `logs/webpack-dev-server.txt`)
        : undefined,
    });

    await timeout(1000 * 5);

    // Arrange
    page = await browser.newPage();

    await page.goto(`http://localhost:${port}`, { timeout: 1000 * 60 });
    await page.waitForSelector('#app', { timeout: 1000 * 60 });

    // Assert
    const time: string = format(1596258181790, 'yyyy-MM-dd hh:mm:ss');
    await expect(page.$eval('#app', (e) => e.innerHTML)).resolves.toBe(
      `Hello Webpack! ${time}`,
    );

    // Exit
    await close();

    console.log(stdout.lastFrame());
  });

  test('should create multiple files', async () => {
    // Arrange : project directories
    const cwd: string = await copyFixture(
      'test/fixtures/webpack-dev-server/multi',
    );

    const port: number = await getPortPromise();

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
      port,
      hostname: 'localhost',
      webpackConfigs: [indexWebpackConfig, anotherWebpackConfig],
      devServerConfig,
      stdout,
      logfile: process.env.CI
        ? path.join(process.cwd(), `logs/webpack-dev-server.txt`)
        : undefined,
    });

    await timeout(1000 * 5);

    // Arrange
    page = await browser.newPage();

    await page.goto(`http://localhost:${port}`, { timeout: 1000 * 60 });
    await page.waitForSelector('#app', { timeout: 1000 * 60 });

    // Assert
    const indexTime: string = format(1596258181790, 'yyyy-MM-dd hh:mm:ss');
    await expect(page.$eval('#app', (e) => e.innerHTML)).resolves.toBe(
      `Hello Webpack! ${indexTime}`,
    );

    await page.goto(`http://localhost:${port}/another.html`, {
      timeout: 1000 * 60,
    });
    await page.waitForSelector('#app', { timeout: 1000 * 60 });

    // Assert
    const anotherTime: string = format(1596258181790, 'yyyy-MM-dd hh:mm:ss');
    await expect(page.$eval('#app', (e) => e.innerHTML)).resolves.toBe(
      `Another Config ${anotherTime}`,
    );

    // Exit
    await close();

    console.log(stdout.lastFrame());
  });
});
