<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Core Rules](#core-rules)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Core Rules

|Rule                                      |Command                  |Result                                    |
|------------------------------------------|-------------------------|------------------------------------------|
|`src/_app/(*|*/index).[jt]sx?`            |`web.build`              |`dist/web/$1.js`                          |
|                                          |`web.dev.build`          |`dist-dev/web/$1.js`                      |
|`public/**/*`                             |`web.build`              |`dist/web/**/*`                           |
|                                          |`web.dev.build`          |`dist-dev/web/**/*`                       |
|`src/_server/index.[jt]sx?`               |`web.server.build`       |`dist/server/index.js`                    |
|                                          |`web.server.dev.build`   |`dist-dev/server/index.js`                |
|`src/_modules/(*|**/*)/index.[jt]sx?`     |`module.build`           |`dist/modules/$1/index.js`                |
|`src/_modules/(*|**/*)/**/*`              |`module.build`           |`dist/modules/$1/**/*`                    |
|`src/**/locales/[a-z]{2}-[A-Z]{2}.json`   |`intl.build`             |`src/generated/locales.json`              |
