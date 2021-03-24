import { start } from '@rocket-scripts/web/start';
import { copyFixture } from '@ssen/copy-fixture';
import { exec } from '@ssen/promised';

(async () => {
  const cwd: string = await copyFixture('test/fixtures/web/proxy');

  // await exec(`yarn --production`, { cwd });
  //await exec(`open ${cwd}`);

  await start({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
  });
})();
