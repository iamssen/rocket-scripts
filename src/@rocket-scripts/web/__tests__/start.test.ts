import { start } from '@rocket-scripts/web/start';
import { createInkWriteStream } from '@ssen/ink-helpers';
import { exec } from '@ssen/promised';
import { copyTmpDirectory, createTmpDirectory } from '@ssen/tmp-directory';
import fs from 'fs-extra';
import path from 'path';
import puppeteer, { Browser, Page } from 'puppeteer';

const timeout = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

describe('start()', () => {
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
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should read h1 text and the text should change with HMR', async () => {
    const cwd: string = await copyTmpDirectory(path.join(process.cwd(), 'test/fixtures/web/start'));
    const out: string = await createTmpDirectory();
    const stdout = createInkWriteStream();

    await exec(`npm install`, { cwd });

    const { port, close } = await start({
      cwd,
      staticFileDirectories: ['{cwd}/public'],
      app: 'app',
      https: false,
      outDir: out,
      stdout,
    });

    await timeout(1000 * 5);

    await page.goto(`http://localhost:${port}`, { timeout: 1000 * 60 });
    await page.waitFor('#app h1', { timeout: 1000 * 60 });

    await expect(page.$eval('#app h1', (e) => e.innerHTML)).resolves.toBe('Hello World!');

    await page.reload({ waitUntil: 'load' });
    await timeout(1000 * 2);

    const file: string = path.join(cwd, 'src/app/index.tsx');
    const source: string = await fs.readFile(file, 'utf8');
    await fs.writeFile(file, source.replace(/(Hello)/g, 'Hi'), { encoding: 'utf8' });

    let count: number = 20;
    while (count >= 0) {
      const text: string = await page.$eval('#app h1', (e) => e.innerHTML);
      if (text === 'Hi World!') {
        break;
      } else if (count === 0) {
        throw new Error(`HMR did not work`);
      }
      await timeout(1000);
      count -= 1;
    }

    await close();

    console.log(stdout.lastFrame());

    await timeout(1000 * 5);
  });

  test('should get static files with multiple static file directories', async () => {
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), 'test/fixtures/web/static-file-directories'),
    );
    const out: string = await createTmpDirectory();
    const stdout = createInkWriteStream();

    await exec(`npm install`, { cwd });

    const { port, close } = await start({
      cwd,
      staticFileDirectories: ['{cwd}/public', '{cwd}/static'],
      app: 'app',
      https: false,
      outDir: out,
      stdout,
    });

    await timeout(1000 * 5);

    await page.goto(`http://localhost:${port}`, { timeout: 1000 * 60 });
    await page.waitFor('#app h1', { timeout: 1000 * 60 });

    await expect(page.$eval('#app h1', (e) => e.innerHTML)).resolves.toBe('Hello World!');

    const manifest = await fetch(`http://localhost:${port}/manifest.json`);

    expect(manifest.status).toBeLessThan(299);

    const hello = await fetch(`http://localhost:${port}/hello.json`);

    expect(hello.status).toBeLessThan(299);

    await close();

    console.log(stdout.lastFrame());

    await timeout(1000 * 5);
  });
});
