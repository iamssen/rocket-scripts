import { start } from '@rocket-scripts/web/start';
import { copyFixture } from '@ssen/copy-fixture';
import { exec } from '@ssen/promised';

(async () => {
  const cwd: string = await copyFixture('test/fixtures/web/webpack-config');

  // await exec(`yarn --production`, { cwd });
  //await exec(`code ${cwd}`);

  await start({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
    webpackConfig: '{cwd}/webpack.config.js',
  });
})();
