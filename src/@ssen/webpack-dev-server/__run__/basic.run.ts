import { exec } from '@ssen/promised';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import { devServerStart } from '@ssen/webpack-dev-server/devServerStart';
import path from 'path';
import { getPortPromise } from 'portfinder';
import puppeteer from 'puppeteer';

(async () => {
  const cwd: string = await copyTmpDirectory(
    path.join(process.cwd(), 'test/fixtures/webpack-dev-server/basic'),
  );

  await exec(`npm install`, { cwd });

  const port: number = await getPortPromise();

  const { devServer: devServerConfig, ...webpackConfig } = require(`${cwd}/webpack.config.js`);

  await devServerStart({
    cwd,
    header: '\nBASIC SAMPLE!!!\n',
    port,
    hostname: 'localhost',
    webpackConfig,
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
