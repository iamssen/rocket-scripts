import { build } from '@rocket-scripts/web/build';
import { exec } from '@ssen/promised';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import path from 'path';

(async () => {
  const cwd: string = await copyTmpDirectory(
    path.join(process.cwd(), 'test/fixtures/web/worker'),
  );

  await exec(`npm install`, { cwd });

  await build({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
  });

  await exec(`code ${cwd}`);
})();
