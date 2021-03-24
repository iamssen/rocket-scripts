import { build } from '@rocket-scripts/web/build';
import { copyFixture } from '@ssen/copy-fixture';
import { exec } from '@ssen/promised';

(async () => {
  const cwd: string = await copyFixture('test/fixtures/web/webpack-config');

  // await exec(`yarn --production`, { cwd });
  //await exec(`code ${cwd}`);

  await build({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
    webpackConfig: '{cwd}/webpack.config.js',
  });

  exec(`code ${cwd}`);
})();
