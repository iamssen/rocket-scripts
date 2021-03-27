import { copyFixture } from '@ssen/copy-fixture';
import { devServerStart } from '@ssen/webpack-watch-server/devServerStart';
import path from 'path';

(async () => {
  const cwd: string = await copyFixture(
    'test/fixtures/webpack-dev-server/basic',
  );

  const webpackConfig = require(`${cwd}/webpack.config.js`);

  await devServerStart({
    cwd,
    header: '\nBASIC SAMPLE!!!\n',
    logfile: path.join(cwd, 'rocket-test.log'),
    webpackConfigs: [webpackConfig],
  });
})();
