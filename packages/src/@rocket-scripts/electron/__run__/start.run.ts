import { start } from '@rocket-scripts/electron';
import { exec } from '@ssen/promised';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import fs from 'fs-extra';
import path from 'path';
import puppeteer, { Browser } from 'puppeteer-core';

const timeout = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

(async () => {
  const cwd: string = await copyTmpDirectory(
    path.join(process.cwd(), 'test/fixtures/electron/start'),
  );
  const remoteDebuggingPort: number = 9366;

  await exec(`yarn`, { cwd });
  //await fs.symlink(path.join(process.cwd(), 'node_modules'), path.join(cwd, 'node_modules'));
  //exec(`code ${cwd}`);

  await start({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
    electronSwitches: {
      'remote-debugging-port': remoteDebuggingPort,
    },
  });

  await timeout(1000 * 5);

  // Arrange : connect electron
  let browser: Browser | null = null;
  const connectTimeout: number = Date.now() + 1000 * 30;

  while (!browser) {
    try {
      browser = await puppeteer.connect({
        browserURL: `http://localhost:${remoteDebuggingPort}`,
      });
    } catch (error) {
      console.log(
        'start.test.ts..()',
        error,
        remoteDebuggingPort,
        Date.now(),
        connectTimeout,
        browser,
      );
      if (Date.now() > connectTimeout) {
        throw error;
      }
    }
  }

  const pages = await browser.pages();

  const page = pages.find((page) => /index\.html$/.test(page.url()));
  if (!page) throw new Error(`Undefined index.html`);

  await page.waitForSelector('#app h1', { timeout: 1000 * 60 });
  const text = await page.$eval('#app h1', (e) => e.innerHTML);

  console.log('start.run.ts..()', text);

  const file: string = path.join(cwd, 'src/app/preload.ts');
  const source: string = await fs.readFile(file, 'utf8');
  await fs.writeFile(file, source.replace(/(Hello)/g, 'Hi'), {
    encoding: 'utf8',
  });

  await timeout(1000 * 5);

  await page.reload();
})();
