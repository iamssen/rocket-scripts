import { copyFixture } from '@ssen/copy-fixture';
import { devServerStart } from '@ssen/webpack-watch-server/devServerStart';
import path from 'path';

(async () => {
  const cwd: string = await copyFixture(
    'test/fixtures/webpack-dev-server/multi',
  );

  const indexWebpackConfig = require(`${cwd}/index.webpack.config.js`);
  const anotherWebpackConfig = require(`${cwd}/another.webpack.config.js`);

  await devServerStart({
    cwd,
    header: '\nMULTI SAMPLE!!!\n',
    logfile: path.join(cwd, 'rocket-test.log'),
    webpackConfigs: [indexWebpackConfig, anotherWebpackConfig],
    outDir: path.join(cwd, 'dev'),
  });
})();
