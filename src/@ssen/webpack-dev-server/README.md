# `@ssen/webpack-dev-server`

Interactive UI for `webpack-dev-server`

<img src="https://raw.githubusercontent.com/rocket-hangar/rocket-scripts/master/docs/screenshot.png" alt="Screenshot" style="max-width: 80%" />

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

# Examples

- [react-redux-typescript-boilerplate](https://github.com/iamssen/react-redux-typescript-boilerplate/compare/09d1c336436662fd978cb081db616ff26d2cda8c...33d5b2fa493d96b524b2880cbf3ab7371d75c6c3)