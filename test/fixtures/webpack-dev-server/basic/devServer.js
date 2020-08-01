const { devServerStart } = require('@ssen/webpack-dev-server');
const { devServer: devServerConfig, ...webpackConfig } = require('./webpack.config');

(async () => {
  const port = process.env.PORT;

  await devServerStart({
    header: '\nBASIC SAMPLE!!!\n',
    port,
    hostname: 'localhost',
    webpackConfig,
    devServerConfig,
  });
})();