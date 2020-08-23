import { start } from '@rocket-scripts/web';
import { parseNumber } from '@rocket-scripts/utils';
import puppeteer from 'puppeteer';

const timeout = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

(async () => {
  const {port} = await start({
    app: 'app',
    port: parseNumber(process.env.PORT) ?? 'random',
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
