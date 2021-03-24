import { start } from '@rocket-scripts/web/start';
import { copyFixture } from '@ssen/copy-fixture';
import { exec } from '@ssen/promised';

(async () => {
  const cwd: string = await copyFixture('test/fixtures/web/start');

  // await exec(`yarn --production`, { cwd });
  //await exec(`code ${cwd}`);

  await start({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
    webpackDevServerConfig: {
      https: {
        cert: process.env.LOCALHOST_HTTPS_CERT,
        key: process.env.LOCALHOST_HTTPS_KEY,
      },
    },
  });
})();
