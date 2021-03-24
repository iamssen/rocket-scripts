import { build } from '@rocket-scripts/electron';
import { copyFixture } from '@ssen/copy-fixture';
import { exec } from '@ssen/promised';
import { createTmpDirectory } from '@ssen/tmp-directory';

(async () => {
  const cwd: string = await copyFixture('test/fixtures/electron/start');
  const outDir: string = await createTmpDirectory();

  await build({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
    outDir,
  });

  exec(`npx electron ${outDir}/main.js`, { cwd: outDir });
})();
