import { start } from '@rocket-scripts/web/start';
import { copyFixture } from '@ssen/copy-fixture';

(async () => {
  const cwd: string = await copyFixture('test/fixtures/web/start');

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
