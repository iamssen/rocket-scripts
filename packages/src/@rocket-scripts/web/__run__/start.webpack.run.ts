import { start } from '@rocket-scripts/web/start';
import { copyFixture } from '@ssen/copy-fixture';

(async () => {
  const cwd: string = await copyFixture('test/fixtures/web/webpack-config');

  await start({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
    webpackConfig: '{cwd}/webpack.config.js',
  });
})();
