<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [View this document in other languages](#view-this-document-in-other-languages)
- [react-zeroconfig](#react-zeroconfig)
- [🚀 Install](#-install)
- [⏰ Quick start CSR App in 3 minutes](#-quick-start-csr-app-in-3-minutes)
- [⏰ Quick start SSR App in 5 minutes](#-quick-start-ssr-app-in-5-minutes)
- [⏰ Quick start Jest Test in 2 minutes](#-quick-start-jest-test-in-2-minutes)
- [📖 User Guide](#-user-guide)
- [🍽 Boilerplates](#%F0%9F%8D%BD-boilerplates)
- [Contribute](#contribute)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# View this document in other languages

- [한국어로 보기](https://github.com/iamssen/react-zeroconfig/blob/master/readme.ko.md)

# react-zeroconfig

[![NPM](https://img.shields.io/npm/v/react-zeroconfig.svg)](https://www.npmjs.com/package/react-zeroconfig)
[![CircleCI](https://circleci.com/gh/iamssen/react-zeroconfig.svg?style=svg)](https://circleci.com/gh/iamssen/react-zeroconfig)
[![DeepScan grade](https://deepscan.io/api/teams/3270/projects/4809/branches/38445/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=3270&pid=4809&bid=38445)
[![Coverage Status](https://coveralls.io/repos/github/iamssen/react-zeroconfig/badge.svg?branch=master)](https://coveralls.io/github/iamssen/react-zeroconfig?branch=master)

> ⚠️ I can not speak English well. It will be helpful if you correct the wrong expressions and send the PR. (If you have modified this document, please delete this comment.)

`react-zeroconfig` is a development support module created to eliminate (as much as possible) complicated configuration files such as Webpack Config, Browser-Sync, Nodemon, Typescript Config and Test Environment Jest Config that occur during React development. (similar to [react-scripts](https://github.com/facebook/create-react-app/tree/master/packages/react-scripts) in [create-react-app](https://github.com/facebook/create-react-app))

- Run test and build without Webpack config.
- Supports ES6, Typescript based on Babel.
- Supports both CSR(Client Side Rendering) and SSR(Server Side Rendering).
- Supports CSS, SASS, LESS and can use CSS Module. 
- Simplifies the testing, building and publishing process for the NPM Module.

# 🚀 Install

```
npm install react-zeroconfig --save-dev
```

# ⏰ Quick start CSR App in 3 minutes

## Step1

```sh
$ mkdir test
$ cd test
$ npm init
$ npm install react react-dom react-app-polyfill
$ npm install react-zeroconfig --save-dev
```

## Step2

Create `src/_app/app.jsx` file.

```jsx
import React from 'react';
import {render} from 'react-dom';
import 'react-app-polyfill/ie11';

function App() {
  return (
    <div>Hello World!</div>
  );
}

render(<App/>, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
```

Create `public/index.html` file.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset=UTF-8>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>App</title>
  </head>
  
  <body>
    <div id="app"></div>
  </body>
  
  <script src="vendor.js"></script>
  <script src="app.js"></script>
</html>
```

## Step3

Add npm scripts to `package.json`.

```diff
{
  "name": "test",
  "version": "1.0.0",
  "scripts": {
+    "web.dev.start": "zeroconfig web.dev.start",
+    "start": "npm run web.dev.start"
  },
  "dependencies": {
    "react": "^16.8.4",
    "react-app-polyfill": "^0.2.2",
    "react-dom": "^16.8.4"
  },
  "devDependencies": {
    "react-zeroconfig": "^2.0.0"
  }
}
```

## Step4

Run

```sh
$ npm start
```

Open your web browser and connect to <http://localhost:3100>.

![start](https://raw.githubusercontent.com/iamssen/react-zeroconfig/master/docs/Client-Side-Rendering/images/start.gif)

# ⏰ Quick start SSR App in 5 minutes

## Step1

```sh
$ mkdir test
$ cd test
$ npm init
$ npm install react react-dom react-app-polyfill express
$ npm install react-zeroconfig multiplerun --save-dev
```

## Step2

Create `src/app/index.jsx` file.

```jsx
import React, { useState } from 'react';

export function App({initialState = {}}) {
  const [value, setValue] = useState(initialState.serverValue || 'Default Value');
  
  function updateValue() {
    setValue('Value ' + Date.now());
  }

  return (
    <div>
      <button onClick={updateValue}>
        {value}
      </button>
    </div>
  );
}
```

Create `src/_entry/app.jsx` file.

```jsx
import React from 'react';
import { hydrate } from 'react-dom';
import { App } from 'app';
import 'react-app-polyfill/ie11';

hydrate((
  <App initialState={window.__INITIAL_STATE__}/> 
), document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
```

Create `src/_server/index.jsx` file.

```jsx
import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { App } from 'app';

const port = process.env.SERVER_PORT || 4100;
const app = express();

const template = ({initialState, body}) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset=UTF-8>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>App</title>
    <script>
      window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
    </script>
  </head>
  
  <body>
    <div id="app">${body}</div>
  </body>
  
  <script src="vendor.js"></script>
  <script src="app.js"></script>
</html>
`;

app.get('/', (req, res) => {
  const initialState = {serverValue: 'Server Value'};
  const body = renderToString(<App initialState={initialState}/>);
  
  res.send(template({initialState, body}));
});

app.listen(port, () => {
  console.log(`Server started ${port}`);
});
```

## Step3

Add npm scripts to `package.json`.

```diff
{
  "name": "test",
  "version": "1.0.0",
  "scripts": {
+    "web.dev.start": "zeroconfig web.dev.start",
+    "web.server.dev.build.watch": "zeroconfig web.server.dev.build.watch",
+    "web.server.dev.start": "zeroconfig web.server.dev.start",
+    "start": "multiplerun development"
  },
+  "multiplerun": {
+    "development": [
+      [
+        "npm run web.server.dev.build.watch",
+        "npm run web.server.dev.start"
+      ],
+      "npm run web.dev.start"
+    ]
+  },
  "dependencies": {
    "express": "^4.16.4",
    "react": "^16.8.4",
    "react-app-polyfill": "^0.2.2",
    "react-dom": "^16.8.4"
  },
  "devDependencies": {
    "multiplerun": "^0.2.1",
    "react-zeroconfig": "^2.0.0"
  }
}
```

## Step4

Run

```sh
$ npm start
```

![start](https://raw.githubusercontent.com/iamssen/react-zeroconfig/master/docs/Server-Side-Rendering/images/start.gif)

Open web browser and connect to <http://localhost:4100> to check the SSR server.

![4100](https://raw.githubusercontent.com/iamssen/react-zeroconfig/master/docs/Server-Side-Rendering/images/4100.png)

Open web browser and connect to <http://localhost:3100>.

![3100](https://raw.githubusercontent.com/iamssen/react-zeroconfig/master/docs/Server-Side-Rendering/images/3100.png)

# ⏰ Quick start Jest Test in 2 minutes

## Step1

```sh
$ mkdir test
$ cd test
$ npm init
$ npm install react-zeroconfig jest --save-dev
```

## Step2

Add Jest related settings to `package.json`.

```diff
{
  "name": "test",
  "version": "1.0.0",
  "scripts": {
+    "test": "jest"
  },
  "devDependencies": {
    "jest": "^24.5.0",
    "react-zeroconfig": "^2.0.6"
  },
+  "jest": {
+    "preset": "react-zeroconfig/configs"
+  }
}
```

## Step3

Create `src/__test__/test.js` file.

```js
describe('Jest test', () => {
  it('Jest test should be run', () => {
    expect('abc').toEqual('abc');
  });
});
```

## Step4

Run

```sh
$ npm test
```

![test](https://raw.githubusercontent.com/iamssen/react-zeroconfig/master/docs/Jest/images/test.gif)


# 📖 User Guide

- [Create Client Side Rendering App](https://github.com/iamssen/react-zeroconfig/blob/master/docs/Client-Side-Rendering/en.md)
- [Create Server Side Rendering App](https://github.com/iamssen/react-zeroconfig/blob/master/docs/Server-Side-Rendering/en.md)
- [Supported Import Types](https://github.com/iamssen/react-zeroconfig/blob/master/docs/Supported-Import-Types/en.md)
- [Alias Rule](https://github.com/iamssen/react-zeroconfig/blob/master/docs/Alias/en.md)
- [Run Test with Jest](https://github.com/iamssen/react-zeroconfig/blob/master/docs/Jest/en.md)
- [Create Module](https://github.com/iamssen/react-zeroconfig/blob/master/docs/Module/en.md)
- [Set up Typescript](https://github.com/iamssen/react-zeroconfig/blob/master/docs/Typescript/en.md)
- [Commands](https://github.com/iamssen/react-zeroconfig/blob/master/docs/Commands/en.md)
- [Config](https://github.com/iamssen/react-zeroconfig/blob/master/docs/Config/en.md)
- [Core Rules](https://github.com/iamssen/react-zeroconfig/blob/master/docs/Core-Rules/readme.md)

# 🍽 Boilerplates

- Client Side Rendering + Javascript <https://github.com/iamssen/react-zeroconfig-javascript-client-side-rendering>
- Client Side Rendering + Typescript <https://github.com/iamssen/react-zeroconfig-typescript-client-side-rendering>
- Server Side Rendering + Javascript <https://github.com/iamssen/react-zeroconfig-javascript-server-side-rendering>
- Server Side Rendering + Typescript <https://github.com/iamssen/react-zeroconfig-typescript-server-side-rendering>
- Lee Seoyeon's Basic Seed <https://github.com/iamssen/seed>

> If you have boilterplate created using `react-zeroconfig`, please let me know by Issue. (or you can edit this file via PR)

# Contribute

Pull Requests are always welcome!

# License
`react-zeroconfig` is open source software licensed as MIT.