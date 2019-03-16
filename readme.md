# react-zeroconfig

`react-zeroconfig`는 React 개발시에 발생하는 Webpack Config, Browser-Sync, Nodemon, Typescript Config, 테스트 환경 Jest Config 등의 복잡한 설정 파일들을 (최대한) 없애고, 실제적인 React 개발에만 집중하기 위해 만든 개발 지원 모듈입니다. ([create-react-app](https://github.com/facebook/create-react-app)의 [react-scripts](https://github.com/facebook/create-react-app/tree/master/packages/react-scripts)와 비슷하게 동작합니다)

- Webpack Config 없이 테스트, 빌드를 실행할 수 있습니다.
- Babel을 기반으로 ES6, Typescript를 지원합니다.
- CSR(Client Side Rendering), SSR(Server Side Rendering)을 모두 지원합니다.
- CSS, SASS, LESS를 지원하고, CSS Module을 사용할 수 있습니다.
- NPM Module에 대한 테스트, 빌드, 퍼블리싱 과정을 단순화 시켜줍니다.

# Install

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

`src/_app/app.jsx` 파일을 만들어줍니다.

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

`public/index.html` 파일을 만들어줍니다.

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

`package.json`에 npm script를 추가해줍니다.

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

실행합니다.

```sh
$ npm start
```

웹브라우저를 열고, <http://localhost:3100> 에 접속합니다.

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

`src/app/index.jsx` 파일을 만들어줍니다.

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

`src/_entry/app.jsx` 파일을 만들어줍니다

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

`src/_server/index.jsx` 파일을 만들어줍니다.

```jsx
import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { App } from '../app';

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

`package.json` 파일에 npm scripts를 추가해줍니다.

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

실행합니다.

```sh
$ npm start
```

![start](https://raw.githubusercontent.com/iamssen/react-zeroconfig/master/docs/Server-Side-Rendering/images/start.gif)

웹브라우저를 열고, <http://localhost:4100>에 접속해서 SSR 서버를 확인합니다.

![4100](https://raw.githubusercontent.com/iamssen/react-zeroconfig/master/docs/Server-Side-Rendering/images/4100.png)

웹브라우저를 열고, <http://localhost:3100>에 접속해서 확인합니다.

![3100](https://raw.githubusercontent.com/iamssen/react-zeroconfig/master/docs/Server-Side-Rendering/images/3100.png)

# 📖 Documents

English
- [Create Client Side Rendering App](https://github.com/iamssen/react-zeroconfig/blob/master/docs/Client-Side-Rendering/en.md)
- [Create Server Side Rendering App](https://github.com/iamssen/react-zeroconfig/blob/master/docs/Server-Side-Rendering/en.md)

한국어
- [Client Side Rendering App 만들어보기](https://github.com/iamssen/react-zeroconfig/blob/master/docs/Client-Side-Rendering/ko.md)
- [Server Side Rendering App 만들어보기](https://github.com/iamssen/react-zeroconfig/blob/master/docs/Server-Side-Rendering/ko.md)
- [Typescript 셋팅하기](https://github.com/iamssen/react-zeroconfig/blob/master/docs/Typescript/ko.md)

# 🍽 Boilerplates

- Basic Seed <https://github.com/iamssen/seed>