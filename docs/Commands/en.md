<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Commands](#commands)
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

# Commands

> ⚠️ I can not speak English well. It will be helpful if you correct the wrong expressions and send the PR. (If you have modified this document, please delete this comment.)

# Web App Build and Test

## `zeroconfig web.build`

Build to the `dist/web/` directory.

## `zeroconfig web.dev.build`

Build to the `dist-dev/web/` directory.

Exclude optimizations.

## `zeroconfig web.dev.build.watch`

Watch the source codes and build each time the source codes are updated.

Run the same operation as `zeroconfig web.dev.build`.

## `zeroconfig web.dev.start`

Run test server. (`webpack-dev-middleware` + `browser-sync` + more...)

# Server App Build and Test

## `zeroconfig web.server.build`

Build to the `dist/server/` directory.

## `zeroconfig web.server.dev.build`

Build to the `dist-dev/server/` directory.

Exclude optimizations.

## `zeroconfig web.server.dev.build.watch`

Watch the source codes and build each time the source codes are updated.

Run the same operation as `zeroconfig web.server.dev.build`.

## `zeroconfig web.server.dev.start`

Run the `dist-dev/server/` directory using Nodemon.

Running with `zeroconfig web.server.dev.build.watch` will re-run the server every time the source codes are updated.

# Module

## `zeroconfig module.build`
Build the `src/_modules/{module-name}/` directories into the `dist/modules/{module-name}/` directories.

## `zeroconfig module.publish`
Publish the `dist/modules/{module-name}` directories to NPM.

# React Intel Support

## `zeroconfig intl.build`

Collect the `src/**/locales/[a-z]{2}-[A-Z]{2}.json` formatted internationalization message files and build into the `src/generated/locales.json` file.

## `zeroconfig intl.distribute`

Use the `src/generated/locales.json` file to update the contents of `src/**/locales/[a-z]{2}-[A-Z]{2}.json` files.

If you use the `locales.json` file to translate, you can use it to updat the json files in each directory.