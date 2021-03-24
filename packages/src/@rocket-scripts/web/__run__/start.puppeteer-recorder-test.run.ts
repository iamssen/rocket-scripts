import { start } from '@rocket-scripts/web';
import { copyFixture } from '@ssen/copy-fixture';
import puppeteer from 'puppeteer';

const timeout = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

(async () => {
  const cwd: string = await copyFixture(
    'test/fixtures/web/puppeteer-recorder-test',
  );

  const { port } = await start({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
  });

  const browser = await puppeteer.launch({
    userDataDir: process.env.CHROMIUM_USER_DATA_DEBUG,
    headless: false,
    args: ['--start-fullscreen'],
    devtools: true,
  });

  const [page] = await browser.pages();
  await page.goto(`http://localhost:${port}`);

  await timeout(500);

  await page.waitForSelector('body > #app > div > button');
  await page.click('body > #app > div > button');

  await timeout(500);

  await page.waitForSelector('body > #app > div > button');
  await page.click('body > #app > div > button');

  await timeout(500);

  await page.waitForSelector('body > #app > div > button');
  await page.click('body > #app > div > button');

  await timeout(500);

  await page.waitForSelector('body > #app > div > button');
  await page.click('body > #app > div > button');

  await timeout(500);

  const value = await page.$eval('#app h1', (e) => e.innerHTML);
  console.assert(value === 'Count = 4');
})();
