# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.31.1] - 2020-04-22
### Fixed
- apply `http-proxy-middleware` 1.x api changed 

### BREAKING CHANGES

- Changed default `browserslist` query (now does not support IE11 with default config)

If you want to support IE11, you have to add browserslist config to your `package.json` like below.

```json
{
  "browserslist": {
    "production": [
      ">0.2%", 
      "not dead", 
      "not op_mini all"
    ],
    "development": [
      "last 2 chrome versions",
      "last 2 firefox versions",
      "last 2 safari versions",
      "ie11"
    ],
    "package": [
      ">0.2%", 
      "not dead", 
      "not op_mini all"
    ]
  }
}
```

## [3.30.0] - 2020-04-21

### Added

- Add parameters `mode` and `source-map` to `zeroconfig-desktopapp-scripts`

## [3.29.4] - 2020-04-13

### Fixed

- Bug fixes...

## [3.29.0] - 2020-03-31

### Fixed

- Improve re-build performance

## [3.28.0] - 2020-03-27

Trism <https://www.npmjs.com/package/trism>

## [3.27.0] - 2020-03-15

### Added

- Add `@handbook/babel-plugin`

## [3.26.0] - 2020-03-03

### Fixed

- Allow import the package name itself (e.g. It is available the `import {} from 'some-package'` from inside the `src/_packages/some-package/` directory)

## [3.25.1] - 2020-02-17

### Added

- Add YAML file support

## [3.24.0] - 2020-02-03

### Addded

- Add `zeroconfig-extension-scripts` command for develop chrome extensions
  - `zeroconfig-extension-scripts watch {app} [--static-file-directories "dir1 dir2"] [--static-file-packages "package1 package2"]`
  - `zeroconfig-extension-scripts build {app} [--static-file-directories "dir1 dir2"] [--static-file-packages "package1 package2"] [--output dir]`

### Fixed

- Fix from the wrong used `basename()` to `dirname()`

## [3.23.2] - 2020-01-24

### Fixed

- Fix "electron is not defined" error on desktop applications

## [3.23.0] - 2020-01-19

### Added

- Add `zeroconfig-desktopapp-scripts` command
  - `zeroconfig-desktopapp-scripts start {app} [--static-file-directories "dir1 dir2"] [--static-file-packages "package1 package2"]`
  - `zeroconfig-desktopapp-scripts build {app} [--static-file-directories "dir1 dir2"] [--static-file-packages "package1 package2"] [--output dir]`
- Add `zeroconfig-package-scripts publish [--choice false]` option for publish packages in CI
- Add `electron` option to `browserslist` config for electron build (default value is `last 1 electron version`)

### Fixed

- Add Node.js API to exclude list in `findInternalPackageMissingDependencies()`
- Change the `getInternalPackageEntry()` from async to sync
- Use the custom sort function for avoid Node.js@10 `Array.sort()` error
- Remove `libraryDirectory: 'esm'` of `babel-plugin-import` for avoid pick esm directories

## [3.22.0] - 2019-12-17

### Added

- Add `--source-map` option to `create-zeroconfig-app build` command

## [3.20.1] - 2019-11-27

### Fixed

- Allow copy `/public/*` directories for `/public/*.js` files in packages

## [3.20.0] - 2019-11-06

### Added

- Add `@babel/plugin-proposal-optional-chaining` and `@babel/plugin-proposal-nullish-coalescing-operator` to babel configs for support TypeScript 3.7 features

## [3.19.0] - 2019-10-28

Nothing. Just dependencies update

## [3.18.0] - 2019-09-20

### Added

- `eslint-loader` use project own eslint config if eslint config exists

### Fixed

- Only set `javascriptEnabled` options for avoid sass option validation error

## [3.17.0] - 2019-08-31

### Added

- Allow copy `src/_packages/{package-name}/bin/*.js`

## [3.16.0] - 2019-08-30

### Added

- Individual package browserslist settings

## [3.15.2] - 2019-08-27

### Fixed

- Add sync logic to `NODE_ENV` and `--mode`

## [3.15.0] - 2019-08-25

### Fixed

- Update `multiplerun@1.1.2` Running ssr start command without opening terminals if not macOS or Windows (This make enable ssr start in CI)

## [3.14.0] - 2019-08-20

### Added

- Add command `zeroconfig-package-scripts sync`

## [3.13.4] - 2019-08-19

### Fixed

- `if (fs.pathExists(...))` to `if (fs.pathExistsSync(...))` in `startBrowser`

## [3.13.3] - 2019-08-13

### Added

- Add `process.env.PUBLIC_URL`
- Available use `REACT_APP_*` process.env in app. <https://create-react-app.dev/docs/adding-custom-environment-variables>
- Available use env in \*.html files (eg. `%PUBLIC_URL%`)

## [3.13.1] - 2019-08-12

### BREAKING CHANGES

- Update `eslint` to `@6`

### Fixed

- Set node modules to "empty" on web builds

## [3.12.0] - 2019-08-10

### Added

- Add command `zeroconfig-package-scripts validate`
- Add command `zeroconfig-package-scripts list`

## [3.10.0] - 2019-08-09

### Added

- Add eslint rule `eslint-config-react-app` (and command line options `--internal-eslint false`)
- copy `*.d.ts` files in `_packages/**` directories

### Fixed

- Fix `.mjs` import error about "Can't import the named export '...' from non EcmaScript module (only default export is available)"

## [3.9.0] - 2019-07-30

### Added

- Support `*.mdx` files (eg. `import JSXComponent from './Document.mdx'`)

## [3.8.4] - 2019-07-29

### Fixed

- `cwd is undefined` error of `getBabelConfig()`

## [3.8.3] - 2019-07-29

### Fixed

- `babel-plugin-styled-components` only will using when `styled-components` exists on `package.json`

## [3.8.2] - 2019-07-29

### Added

- `@material-ui/core` and `@material-ui/icons` use `babel-plugin-import`

## [3.8.1] - 2019-07-26

### Fixed

- Remove `tslint-loader` on `patchStorybookWebpackConfig`

## [3.8.0] - 2019-07-23

### Added

- Add `babel-plugin-styled-components` for `<Component css={} />` syntax

### Fixed

- Update [`babel@^7.5.5`](https://github.com/babel/babel/issues/10179)

## [3.7.0] - 2019-07-10

### Fixed

- Update [`webpack@^4.35.3`](https://github.com/webpack/webpack/commit/b56c3ecf1c5dee350b80b72193892740dc25e61d#diff-b9cfc7f2cdf78a7f4b91a753d10865a2)

## [3.6.1] - 2019-06-21

### Fixed

- Add the webpack alias to storybook webpack config

## [3.6.0] - 2019-06-14

### Added

- Add proxy config for prevent CORS error

## [3.5.0] - 2019-06-08

### Added

- `npm publish --tag` will use prerelease version name (eg. `2.0.0-alpha.1` to `npm publish --tag alpha`)

## [3.4.0] - 2019-06-08

### Added

- Using env `PORT` and `SERVER_PORT` in `zeroconfig-webapp-scripts start` command

## [3.3.1] - 2019-06-06

### Fixed

- Fix incorrect location of `getTSConfigCompilerOptions()`

## [3.3.0] - 2019-06-06

### Changed

- tsconfig's `strictFunctionTypes` to `true`

[3.31.1]: https://github.com/react-zeroconfig/react-zeroconfig/compare/react-zeroconfig@3.30.0...react-zeroconfig@3.31.1
[3.30.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/react-zeroconfig@3.29.4...react-zeroconfig@3.30.0
[3.29.4]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.29.0...react-zeroconfig@3.29.4
[3.29.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.28.0...3.29.0
[3.28.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.27.0...3.28.0
[3.27.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.26.0...3.27.0
[3.26.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.25.1...3.26.0
[3.25.1]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.24.0...3.25.1
[3.24.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.23.2...3.24.0
[3.23.2]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.23.0...3.23.2
[3.23.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.22.0...3.23.0
[3.22.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.20.1...3.22.0
[3.20.1]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.20.0...3.20.1
[3.20.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.19.0...3.20.0
[3.19.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.18.0...3.19.0
[3.18.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.17.0...3.18.0
[3.17.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.16.0...3.17.0
[3.16.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.15.2...3.16.0
[3.15.2]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.15.0...3.15.2
[3.15.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.14.0...3.15.0
[3.14.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.13.4...3.14.0
[3.13.4]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.13.3...3.13.4
[3.13.3]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.13.1...3.13.3
[3.13.1]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.12.0...3.13.1
[3.12.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.10.0...3.12.0
[3.10.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.9.0...3.10.0
[3.9.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.8.4...3.9.0
[3.8.4]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.8.3...3.8.4
[3.8.3]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.8.2...3.8.3
[3.8.2]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.8.1...3.8.2
[3.8.1]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.8.0...3.8.1
[3.8.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.7.0...3.8.0
[3.7.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.6.1...3.7.0
[3.6.1]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.6.0...3.6.1
[3.6.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.5.0...3.6.0
[3.5.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.4.0...3.5.0
[3.4.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.3.1...3.4.0
[3.3.1]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.3.0...3.3.1
[3.3.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.2.0...3.3.0
