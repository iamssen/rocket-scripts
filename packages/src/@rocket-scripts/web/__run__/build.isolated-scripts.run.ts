import { build } from '@rocket-scripts/web/build';
import { copyFixture } from '@ssen/copy-fixture';
import { exec } from '@ssen/promised';

(async () => {
  const cwd: string = await copyFixture('test/fixtures/web/isolated-scripts');

  await build({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
    isolatedScripts: {
      isolate: 'isolate.ts',
    },
  });

  exec(`code ${cwd}`);
})();
