import { start } from '@rocket-scripts/electron';
import { createInkWriteStream } from '@ssen/ink-helpers';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import fs from 'fs-extra';
import getPort from 'get-port';
import path from 'path';
import puppeteer, { Browser } from 'puppeteer-core';

const timeout = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

describe('electron/start', () => {
  test.each(['start'])(
    'should read h1 text and the text should change with watch (%s)',
    async (dir: string) => {
      // Arrange : project directories
      const cwd: string = await copyTmpDirectory(path.join(process.cwd(), `test/fixtures/electron/${dir}`));
      const staticFileDirectories: string[] = ['{cwd}/public'];
      const app: string = 'app';
      const remoteDebuggingPort: number = await getPort({ port: getPort.makeRange(9266, 10366) });

      //await exec(`code ${cwd}`);

      //await exec(`npm install`, { cwd });
      await fs.symlink(path.join(process.cwd(), 'node_modules'), path.join(cwd, 'node_modules'));

      // Arrange : stdout
      const stdout = createInkWriteStream();

      // Act : server start
      const { close } = await start({
        cwd,
        staticFileDirectories,
        app,
        stdout,
        logfile: '{cwd}/log.txt',
        electronSwitches: {
          'remote-debugging-port': remoteDebuggingPort.toString(),
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
          console.log('start.test.ts..()', error, remoteDebuggingPort, Date.now(), connectTimeout, browser);
          if (Date.now() > connectTimeout) {
            throw error;
          }
        }
      }

      const pages = await browser.pages();
      const page = pages[pages.length - 1];

      await page.waitForSelector('#app h1', { timeout: 1000 * 60 });

      // Assert
      await expect(page.$eval('#app h1', (e) => e.innerHTML)).resolves.toBe('Hello World!');

      // Act : update source file to be causing webpack watch
      const file: string = path.join(cwd, 'src/app/preload.ts');
      const source: string = await fs.readFile(file, 'utf8');
      await fs.writeFile(file, source.replace(/(Hello)/g, 'Hi'), { encoding: 'utf8' });

      await timeout(1000 * 5);

      await page.reload({ waitUntil: 'load' });

      await timeout(1000 * 5);

      await page.waitForSelector('#app h1', { timeout: 1000 * 60 });

      // Assert : update browser text by webpack watch
      await expect(page.$eval('#app h1', (e) => e.innerHTML)).resolves.toBe('Hi World!');

      // Exit
      browser.disconnect();
      await close();

      console.log(stdout.lastFrame());
    },
  );
});
