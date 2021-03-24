import { start } from '@rocket-scripts/web/start';
import { copyFixture } from '@ssen/copy-fixture';

(async () => {
  const cwd: string = await copyFixture('test/fixtures/web/proxy');

  await start({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
  });
})();
