import { build } from '@rocket-scripts/web';

(async () => {
  await build({
    app: 'app',
    webpackConfig: '{cwd}/webpack.config.js',
  });
})();
