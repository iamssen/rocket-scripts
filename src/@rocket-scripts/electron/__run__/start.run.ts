import { start } from '@rocket-scripts/electron';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';

(async () => {
  const cwd: string = await copyTmpDirectory(path.join(process.cwd(), 'test/fixtures/electron/start'));

  await fs.symlink(path.join(process.cwd(), 'node_modules'), path.join(cwd, 'node_modules'));
  exec(`code ${cwd}`);

  await start({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
  });
})();
