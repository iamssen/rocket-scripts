# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.19.0] - 2019-10-28
Nothing. Just dependencies update.

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
- Available use env in *.html files (eg. `%PUBLIC_URL%`)

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
* Fix incorrect location of `getTSConfigCompilerOptions()`

## [3.3.0] - 2019-06-06
### Changed
- tsconfig's `strictFunctionTypes` to `true`

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