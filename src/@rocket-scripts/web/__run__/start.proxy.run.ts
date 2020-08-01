import { start } from '@rocket-scripts/web/start';
import { exec } from '@ssen/promised';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import path from 'path';

(async () => {
  const cwd: string = await copyTmpDirectory(path.join(process.cwd(), 'test/fixtures/web/proxy'));

  await exec(`npm install`, { cwd });
  //await exec(`open ${cwd}`);

  await start({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
    https: false,
  });
})();
