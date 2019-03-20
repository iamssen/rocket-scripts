<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [지원되는 명령어 리스트](#%EC%A7%80%EC%9B%90%EB%90%98%EB%8A%94-%EB%AA%85%EB%A0%B9%EC%96%B4-%EB%A6%AC%EC%8A%A4%ED%8A%B8)
- [Web App Build and Test](#web-app-build-and-test)
  - [`zeroconfig web.build`](#zeroconfig-webbuild)
  - [`zeroconfig web.dev.build`](#zeroconfig-webdevbuild)
  - [`zeroconfig web.dev.build.watch`](#zeroconfig-webdevbuildwatch)
  - [`zeroconfig web.dev.start`](#zeroconfig-webdevstart)
- [Server App Build and Test](#server-app-build-and-test)
  - [`zeroconfig web.server.build`](#zeroconfig-webserverbuild)
  - [`zeroconfig web.server.dev.build`](#zeroconfig-webserverdevbuild)
  - [`zeroconfig web.server.dev.build.watch`](#zeroconfig-webserverdevbuildwatch)
  - [`zeroconfig web.server.dev.start`](#zeroconfig-webserverdevstart)
- [Module](#module)
  - [`zeroconfig module.build`](#zeroconfig-modulebuild)
  - [`zeroconfig module.publish`](#zeroconfig-modulepublish)
- [React Intel Support](#react-intel-support)
  - [`zeroconfig intl.build`](#zeroconfig-intlbuild)
  - [`zeroconfig intl.distribute`](#zeroconfig-intldistribute)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 지원되는 명령어 리스트

# Web App Build and Test

## `zeroconfig web.build`

`dist/web/` 디렉토리로 빌드합니다.

## `zeroconfig web.dev.build`

`dist-dev/web/` 디렉토리로 빌드합니다.

최적화 작업을 제외합니다.

## `zeroconfig web.dev.build.watch`

Source Code를 Watch해서, 파일들이 Update 될때마다 빌드를 수행합니다.

`zeroconfig web.dev.build`와 동일한 작업을 수행합니다.

## `zeroconfig web.dev.start`

Test Server를 실행합니다. (`webpack-dev-middleware` + `browser-sync` + more...)

# Server App Build and Test

## `zeroconfig web.server.build`

`dist/server/` 디렉토리로 빌드합니다.

## `zeroconfig web.server.dev.build`

`dist-dev/server/` 디렉토리로 빌드합니다.

최적화 작업을 제외합니다.

## `zeroconfig web.server.dev.build.watch`

Source Code를 Watch해서, 파일들이 Update 될때마다 빌드를 수행합니다.

`zeroconfig web.server.dev.build`와 동일한 작업을 수행합니다.

## `zeroconfig web.server.dev.start`

`dist-dev/server/` 디렉토리를 Nodemon을 사용해서 실행합니다.

`zeroconfig web.server.dev.build.watch`와 함께 실행하면 Source Code가 업데이트 될때마다 Server가 재실행 됩니다.

# Module

## `zeroconfig module.build`
`src/_modules/{module-name}/` 디렉토리를 `dist/modules/{module-name}/` 디렉토리로 빌드합니다.

## `zeroconfig module.publish`
`dist/modules/` 하위에 있는 디렉토리들을 NPM으로 퍼블리시 합니다.

# React Intel Support

## `zeroconfig intl.build`

`src/**/locales/[a-z]{2}-[A-Z]{2}.json` 형식의 다국어 파일들을 수집해서 `src/generated/locales.json` 파일로 빌드합니다.

## `zeroconfig intl.distribute`

`src/generated/locales.json` 파일의 내용을 사용해서 `src/**/locales/[a-z]{2}-[A-Z]{2}.json` 파일들의 내용을 업데이트 합니다.

`locales.json` 파일을 사용해서 번역 작업을 진행한 경우, 역으로 각 디렉토리의 json 파일들을 업데이트 할 때 사용할 수 있습니다.