import { start } from '@rocket-scripts/web/start';
import { exec } from '@ssen/promised';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import path from 'path';
import puppeteer from 'puppeteer';

(async () => {
  const cwd: string = await copyTmpDirectory(path.join(process.cwd(), 'test/fixtures/web/start'));

  await exec(`npm install`, { cwd });
  //await exec(`code ${cwd}`);

  const { port } = await start({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
    https: false,
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
