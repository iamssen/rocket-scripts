import { copyFixture } from '@ssen/copy-fixture';
import { devServerStart } from '@ssen/webpack-dev-server/devServerStart';
import path from 'path';
import { getPortPromise } from 'portfinder';
import puppeteer from 'puppeteer';

(async () => {
  const cwd: string = await copyFixture(
    'test/fixtures/webpack-dev-server/multi',
  );

  const port: number = await getPortPromise();

  const {
    devServer: devServerConfig,
    ...indexWebpackConfig
  } = require(`${cwd}/index.webpack.config.js`);

  const anotherWebpackConfig = require(`${cwd}/another.webpack.config.js`);

  await devServerStart({
    cwd,
    header: '\nMULTI SAMPLE!!!\n',
    port,
    logfile: path.join(cwd, 'rocket-test.log'),
    hostname: 'localhost',
    webpackConfigs: [indexWebpackConfig, anotherWebpackConfig],
    devServerConfig,
  });

  const browser = await puppeteer.launch({
    userDataDir: process.env.CHROMIUM_USER_DATA_DEBUG,
    headless: false,
    args: ['--start-fullscreen'],
    devtools: true,
  });

  const [page] = await browser.pages();
  await page.goto(`http://localhost:${port}`);
})();
