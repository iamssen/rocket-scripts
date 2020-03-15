import puppeteer, { Browser, Page } from 'puppeteer';

describe('E2E Sample', () => {
  test('Test', async () => {
    const browser: Browser = await puppeteer.launch({ headless: true });
    const page: Page = await browser.newPage();

    await page.goto('http://localhost:3100');
    await page.waitForSelector('#app > h1');

    await expect(page.$eval('#app > h1', e => e.innerHTML)).resolves.toEqual('Hello World!');

    await browser.close();
  });
});
