import { start } from '@rocket-scripts/web/start';
import { exec } from '@ssen/promised';
import { copyTmpDirectory, createTmpDirectory } from '@ssen/tmp-directory';
import AbortController from 'abort-controller';
import path from 'path';
import puppeteer, { Browser, Page } from 'puppeteer';

async function task() {
  const cwd: string = await copyTmpDirectory(path.join(process.cwd(), 'test/fixtures/web/start'));
  const out: string = await createTmpDirectory();

  await exec(`npm install`, { cwd });

  const abort: AbortController = new AbortController();

  const { port } = await start({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
    https: false,
    outDir: out,
    signal: abort.signal,
  });

  const browser: Browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1200,
      height: 900,
    },
  });

  const page: Page = await browser.newPage();

  await page.goto(`http://localhost:${port}`);
  await page.waitFor('#app h1', { timeout: 1000 * 60 });

  const message: string = await page.$eval('#app h1', (e) => e.innerHTML);

  console.assert(message === 'Hello World!');

  await browser.close();
  abort.abort();
}

task();
