# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[3.8.1]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.8.0...3.8.1
[3.8.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.7.0...3.8.0
[3.7.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.6.1...3.7.0
[3.6.1]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.6.0...3.6.1
[3.6.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.5.0...3.6.0
[3.5.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.4.0...3.5.0
[3.4.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.3.1...3.4.0
[3.3.1]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.3.0...3.3.1
[3.3.0]: https://github.com/react-zeroconfig/react-zeroconfig/compare/3.2.0...3.3.0