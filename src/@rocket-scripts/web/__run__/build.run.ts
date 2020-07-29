import { build } from '@rocket-scripts/web/build';
import { exec } from '@ssen/promised';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import path from 'path';

(async () => {
  const cwd: string = await copyTmpDirectory(path.join(process.cwd(), 'test/fixtures/web/start'));

  await exec(`npm install`, { cwd });
  //await exec(`code ${cwd}`);

  await build({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
  });

  exec(`code ${cwd}`);
})();
