import { start } from '@rocket-scripts/web/start';
import { copyFixture } from '@ssen/copy-fixture';
import puppeteer from 'puppeteer';

(async () => {
  const cwd: string = await copyFixture('test/fixtures/web/proxy');

  const { port } = await start({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
    webpackDevServerConfig: {
      proxy: {
        '/api': {
          target: 'http://labs.ssen.name',
          changeOrigin: true,
          logLevel: 'debug',
          pathRewrite: {
            '^/api': '',
          },
        },
      },
    },
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
