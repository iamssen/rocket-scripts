import { build } from '@rocket-scripts/electron';
import { exec } from '@ssen/promised';
import { copyTmpDirectory, createTmpDirectory } from '@ssen/tmp-directory';
import fs from 'fs-extra';
import path from 'path';

(async () => {
  const cwd: string = await copyTmpDirectory(path.join(process.cwd(), 'test/fixtures/electron/start'));
  const outDir: string = await createTmpDirectory();

  await exec(`yarn`, { cwd });
  //await fs.symlink(path.join(process.cwd(), 'node_modules'), path.join(cwd, 'node_modules'));

  await build({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
    outDir,
  });

  exec(`npx electron ${outDir}/main.js`, { cwd: outDir });
})();
