<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [`react-zeroconfig` config](#react-zeroconfig-config)
- [Example](#example)
- [Options](#options)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# `react-zeroconfig` config

> ⚠️ I can not speak English well. It will be helpful if you correct the wrong expressions and send the PR. (If you have modified this document, please delete this comment.)

The config can be entered in `package.json`, or by creating a file such as `zeroconfig.config.js` or `zeroconfig.local.config.js`

The priority to read the config is as below.

1. `zeroconfig.local.config.js`
2. `zeroconfig.config.js`
3. the `zeroconfig` entry in the`package.json` file

# Example

```diff
{
  "name": "some-project",
+  "zeroconfig": {
+    "app": {
+      "port": 7777
+    }
+  }
}
```

If you set the `zeroconfig` option in the `package.json` file as above, the test server will be opened with <http://localhost:7777>.

# Options

The options that can be set are as below.

```typescript
{
  app: {
    // Port of test server
    port?: number = 3100;

    // Directories to use as static files
    // `{static file directory}/test.png` → `{build root}/test.png`
    staticFileDirectories?: string[] = ['./public'];

    // Build path
    // If you enter `build/path`, it will be built as `{build root}/build/path/app.js`
    buildPath?: string = '';

    // Set test server to https
    // https://browsersync.io/docs/options#option-https
    https?: boolean | {key: string, cert: string} = false;

    // Vendor chunk file name
    vendorFileName?: string = 'vendor';

    // Style file name
    styleFileName?: string = 'style';

    // Webpack `publicPath`
    // https://webpack.js.org/guides/public-path/
    publicPath?: string = '';

    // Port of SSR test server
    serverPort?: number = 4100;
  }
}
```

More detailed options can be found in the <https://github.com/iamssen/react-zeroconfig/blob/master/src/types.ts#L6> file.