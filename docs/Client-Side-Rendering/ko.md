<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Client Side Rendering App 만들어보기](#client-side-rendering-app-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EA%B8%B0)
- [Install](#install)
- [Code 작성하기](#code-%EC%9E%91%EC%84%B1%ED%95%98%EA%B8%B0)
- [테스트 실행](#%ED%85%8C%EC%8A%A4%ED%8A%B8-%EC%8B%A4%ED%96%89)
- [HMR (Hot Module Replacement) 작동 확인하기](#hmr-hot-module-replacement-%EC%9E%91%EB%8F%99-%ED%99%95%EC%9D%B8%ED%95%98%EA%B8%B0)
- [빌드하기](#%EB%B9%8C%EB%93%9C%ED%95%98%EA%B8%B0)
- [http-server로 빌드된 파일들을 확인해보기](#http-server%EB%A1%9C-%EB%B9%8C%EB%93%9C%EB%90%9C-%ED%8C%8C%EC%9D%BC%EB%93%A4%EC%9D%84-%ED%99%95%EC%9D%B8%ED%95%B4%EB%B3%B4%EA%B8%B0)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Client Side Rendering App 만들어보기

> 이 문서의 소스코드는 <https://github.com/iamssen/react-zeroconfig-sample.client-side-rendering>에서 확인할 수 있습니다.

# Install

프로젝트 디렉토리를 초기화하고

```sh
$ mkdir test
$ cd test
$ npm init
```

필요한 모듈들을 설치해줍니다.

```sh
$ npm install react react-dom react-app-polyfill
$ npm install react-zeroconfig --save-dev
```

# Code 작성하기

간단한 “Hello World” Code를 작성해봅니다.

작성할 파일들은 아래와 같습니다.

- `src/_app/app.jsx`: App의 Entry point 입니다.
- `public/index.html`

```jsx
// {your-project-root}/src/_app/app.jsx
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

```html
<!-- {your-project-root}/public/index.html -->
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

- `<script src="vendor.js"></script>`: `node_modules/` 디렉토리의 모듈들이 포함되게 됩니다 (ex. `react`, `react-dom`...)
- `<script src="app.js"></script>`: `src/_app/app.jsx` 파일에 의해 만들어집니다
  - `src/_app/{name}.jsx` → `{name}.js`

# 테스트 실행

`package.json` 파일을 열어서, 아래에 `+`가 표시된 npm script를 추가해줍니다.

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

- `zeroconfig web.dev.start`: 개발용 Server를 실행시킵니다.

npm script를 실행합니다.

```sh
$ npm start
```

[![start](images/start.gif)](images/start.gif)

웹브라우저를 열고, <http://localhost:3100> 에 접속해서 확인합니다.

# HMR (Hot Module Replacement) 작동 확인하기

`react-zeroconfig`는 HMR(Hot Module Replacement)를 지원합니다.

`src/_app/app.jsx` 파일을 열고, “Hello World!” 문구를 수정해봅니다.

[![hmr](images/hmr.gif)](images/hmr.gif)

웹브라우저 상에서 실시간으로 수정 사항이 반영되는 것을 확인할 수 있습니다.

> ⚠️ HMR 기능이 모든 수정을 100% 반영해주지는 않습니다. Refresh를 해야하는 경우도 생깁니다.

# 빌드하기

`package.json` 파일을 열어서, 아래 `+`가 표시된 npm script를 추가합니다.

```diff
{
  "name": "test",
  "version": "1.0.0",
  "description": "",
  "scripts": {
+    "web.build": "zeroconfig web.build",
    "web.dev.start": "zeroconfig web.dev.start",
    "start": "npm run web.dev.start",
+    "build": "npm run web.build"
  },
  "author": "",
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

- `zeroconfig web.build`: 웹브라우저에서 실행할 수 있는 결과물을 `dist/web/` 디렉토리로 빌드합니다.

npm script를 실행합니다.

```sh
$ npm run build
```

[![build](images/build.gif)](images/build.gif)
[![build](images/build.png)](images/build.png)

`dist/web/` 디렉토리에 js, html 파일들이 빌드된 것을 확인할 수 있습니다.

--------

# http-server로 빌드된 파일들을 확인해보기

빌드된 파일들이 정상적으로 동작하는지 확인해봅니다.

Static Web Server를 간편하게 실행할 수 있는 `http-server`를 설치합니다.

```sh
$ npm install -g http-server
```

`dist/web/` 디렉토리로 이동한 다음, Port 9990으로 Web Server를 실행해봅니다.

```sh
$ cd dist/web
$ http-server . -p 9990
```

<http://localhost:9990> 에 접속해서 확인할 수 있습니다.

[![http-server](images/http-server.gif)](images/http-server.gif)
