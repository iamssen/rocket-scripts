import { createInkWriteStream } from '@ssen/ink-helpers';
import { exec } from '@ssen/promised';
import { copyTmpDirectory } from '@ssen/tmp-directory';
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

  test('should read text and the text should change with HMR', async () => {
    // Arrange : project directories
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), 'test/fixtures/webpack-dev-server/basic'),
    );

    const port: number = await getPortPromise();

    await exec(`npm install`, { cwd });

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
    await page.waitFor('#app', { timeout: 1000 * 60 });

    // Assert
    const time: string = format(1596258181790, 'yyyy-MM-dd hh:mm:ss');
    await expect(page.$eval('#app', (e) => e.innerHTML)).resolves.toBe(
      `Hello Webpack! ${time}`,
    );

    // Exit
    await close();

    console.log(stdout.lastFrame());
  });
});
