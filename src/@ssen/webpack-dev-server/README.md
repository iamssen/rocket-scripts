# `@ssen/webpack-dev-server`

Interactive UI for `webpack-dev-server`

<img src="https://github.com/rocket-hangar/rocket-scripts/blob/master/src/@ssen/webpack-dev-server/__readme__/screenshot.png" alt="Screenshot" style="max-width: 80%" />

# Usage

```js
// devServer.js
const { devServerStart } = require('@ssen/webpack-dev-server');

const { devServer: devServerConfig, ...webpackConfig } = require('./webpack.config');

(async () => {
  const port = process.env.PORT;

  await devServerStart({
    header: '\nHEADER TEXT\n',
    port,
    hostname: 'localhost',
    webpackConfig,
    devServerConfig,
  });
})();
```

```sh
node devServer.js
```