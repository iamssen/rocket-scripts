import { watch } from '@rocket-scripts/web/watch';
import { copyFixture } from '@ssen/copy-fixture';
import { exec } from '@ssen/promised';

(async () => {
  const cwd: string = await copyFixture('test/fixtures/web/isolated-scripts');

  await watch({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
    isolatedScripts: {
      isolate: 'isolate.ts',
    },
  });

  exec(`code ${cwd}`);
})();
