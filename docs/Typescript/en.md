<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Setting Typescript](#setting-typescript)
- [Install Typescript, and create a `tsconfig.json` file](#install-typescript-and-create-a-tsconfigjson-file)
- [Install Typescript declaration files with `typesync`](#install-typescript-declaration-files-with-typesync)
- [Create the `typings.d.ts` file](#create-the-typingsdts-file)
- [Set up TSLint](#set-up-tslint)
- [Change file extension `*.jsx` to `*.tsx`](#change-file-extension-jsx-to-tsx)
- [Test](#test)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Setting Typescript

> ⚠️ I can not speak English well. It will be helpful if you correct the wrong expressions and send the PR. (If you have modified this document, please delete this comment.)

> This example follows [Client Side Rendering](../Client-Side-Rendering/ko.md).

In `react-zeroconfig` you can use the Babel-based Typescript language besides ES6.

It also supports presets like `tsconfig.json`, `typings.d.ts`, and `tslint.json` which are necessary for using Typescript, so it is possible to use more simple Typescript.

> The source codes for this document can be found at <https://github.com/iamssen/react-zeroconfig-sample.typescript>.

# Install Typescript, and create a `tsconfig.json` file

Install Typescript.

```sh
$ npm install typescript --save-dev
```

Create a `tsconfig.json` file.

```json5
// {your-project-root}/tsconfig.json
{
  "extends": "react-zeroconfig/configs/tsconfig",
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "*": [
        "_modules/*",
        "*"
      ]
    }
  },
  "exclude": [
    "dist",
    "dist-dev",
    "*.js"
  ]
}
```

- The default Typescript setting is inherited from `react-zeroconfig/configs/tsconfig`.
  - <https://github.com/iamssen/react-zeroconfig/blob/master/configs/tsconfig.json> It will inherit this file.
- Set `baseUrl`and `paths`.
  - When importing `import z from 'x/y/z'`, it will find on the `<baseUrl>/x/y/z` or `<baseUrl>/_modules/x/y/z`.
  - Technically, you can find more information at <https://www.typescriptlang.org/docs/handbook/module-resolution.html>.
- The `exclude` setting ensure that Typescript compilation does not include the `dist/` directory or the `dist-dev/` directory or `*.js` files.

# Install Typescript declaration files with `typesync`

Declaration files are needed for Typescript to work properly.

> For example, `react` <https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts> these files need `react` to work properly in Typescript.

1. The module itself may have a Typescript declaration file. <https://github.com/moment/moment/blob/develop/moment.d.ts>. if it has its own `*.d.ts` file, like moments, you do not need to set up a separate declaration file.
2. Otherwise, you can get a Typescript declaration file with `npm install @types/{name} --save-dev`. (For example, `react` installs `@types/react`)

You can install Typescript declaration files like `npm install @types/react --save-dev`, but it is quite cumbersome. you can use `typesync` to automate this task.

Install `typesync`.

```sh
$ npm install -g typesync 
```

Run `typesync` in the project directory.

```sh
$ typesync
```

[![typesync](images/typesync.gif)](images/typesync.gif)

`typesync` adds the `@types/*` modules to `package.json` like above.

# Create the `typings.d.ts` file

Create the `typings.d.ts` file.

```typescript
// {your-project-root}/src/typings.d.ts
/// <reference types="react-zeroconfig/configs/typings"/>

```
> The `react-zeroconfig/configs/typings` file can be found at <https://github.com/iamssen/react-zeroconfig/blob/master/configs/typings.d.ts>.

In addition, there is a declaration that can not be found in `typesync`. you can add it to this file. (See <https://www.typescriptlang.org/docs/handbook/modules.html> for details on creating a declaration)

```typescript
// {your-project-root}/src/typings.d.ts
/// <reference types="react-zeroconfig/configs/typings"/>

// For example, you can write a declaration for `some-module` in this way
declare module 'some-module' {
  export const foo: () => string;
}
```

> The file name does not have to be `typings.d.ts`. it only need to have the `*.d.ts` extension.

# Set up TSLint

TSLint helps to enhance the detection capabilities of Typescript.

Install TSLint and TSLint ruleset.

```sh
$ npm install tslint tslint-ssen-rules --save-dev
```

> There are many other well-known rulesets, but here I will proceed with the ruleset I use.

Create a `tslint.json` file.

```json5
// {your-project-root}/tslint.json
{
  "extends": "tslint-ssen-rules"
}
```

Open the `package.json` file and add the npm script marked `+`.

```diff
// {your-project-root}/package.json
{
  "name": "test",
  "version": "1.0.0",
  "scripts": {
    "web.build": "zeroconfig web.build",
    "web.dev.start": "zeroconfig web.dev.start",
    "start": "npm run web.dev.start",
    "build": "npm run web.build",
+    "lint": "tslint \"src/**/!(*.spec|*.test).ts?(x)\""
  },
  "license": "MIT",
  "dependencies": {
    "react": "^16.8.3",
    "react-dom": "^16.8.3"
  },
  "devDependencies": {
    "react-zeroconfig": "^2.0.0",
    "tslint": "^5.13.0",
    "tslint-ssen-rules": "^1.1.0",
    "typescript": "^3.3.3333",
    "@types/react": "^16.8.5",
    "@types/react-dom": "^16.8.2"
  }
}
```

# Change file extension `*.jsx` to `*.tsx`

When the Typescript setting is completed, change the file extension of `src/_app/app.jsx` to `src/_app/app.tsx`.

[![error](images/error.png)](images/error.png)

If you change the file extension to `*.tsx`, you will get this error.

There are some modules that `typesync` can not find, and these modules have to be installed manually.

Install `@types/webpack-env` which contains HMR-related declarations.

```sh
$ npm install @types/webpack-env --save-dev
```

# Test

Once all the work is done, check if the npm scripts are working properly.

```sh
$ npm run lint
```

[![lint](images/lint.gif)](images/lint.gif)

```sh
$ npm start
```

[![start](images/start.gif)](images/start.gif)

```sh
$ npm run build
```

[![build](images/build.gif)](images/build.gif)