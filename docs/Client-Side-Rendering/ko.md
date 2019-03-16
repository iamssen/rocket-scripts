# Client Side Rendering

> 이 문서의 소스코드는 <https://github.com/iamssen/react-zeroconfig-sample.client-side-rendering>에서 확인할 수 있습니다.

## Install

```sh
$ mkdir test
$ cd test
$ npm init
```

프로젝트 디렉토리를 초기화하고

```sh
$ npm install react react-dom react-app-polyfill
$ npm install react-zeroconfig --save-dev
```

필요한 모듈들을 설치해줍니다.

- `react`, `react-dom`: React
- `react-app-polyfill`: IE를 지원하기 위한 Polyfill
- `react-zeroconfig`: Zeroconfig

## Code 작성하기

“Hello World” Code를 작성해봅니다.

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

`node_modules` 디렉토리에 속한 `react`와 `react-dom`, `react-app-polyfill`과 같은 라이브러리는 `<script src=”vendor.js”></script>` 파일로 생성됩니다.

`src/` 디렉토리에 속한 `_app/app.jsx` 파일은 `<script src=”app.js”></script>` 파일로 생성됩니다. (`_entry/{name}.jsx` 파일이 `<script src=”{name}.js”></script>`로 생성되는 구조입니다)

## 테스트 실행

`package.json` 파일을 열어서, 아래에 `+`가 표시된 npm script를 추가해줍니다.

```diff
{
  "name": "test",
  "version": "1.0.0",
  "description": "",
  "scripts": {
+    "web.dev.start": "zeroconfig web.dev.start",
+    "start": "npm run web.dev.start"
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

- `zeroconfig web.dev.start`는 `webpack-dev-middleware`, `webpack-hot-middleware`, `browser-sync` 등을 조합해서 개발용 Server를 실행시킵니다.

```sh
$ npm start
```

npm script를 실행합니다.

[![start](images/start.gif)](images/start.gif)

웹브라우저를 열고, <http://localhost:3100> 에 접속합니다.

“Hello World!”가 뜨면 성공입니다.

## HMR (Hot Module Replacement) 작동 확인하기

`react-zeroconfig`는 HMR(Hot Module Replacement)를 지원합니다.

`src/_entry/app.jsx` 파일을 열고, “Hello World!” 문구를 수정해봅니다.

[![hmr](images/hmr.gif)](images/hmr.gif)

웹브라우저 상에서 실시간으로 수정 사항이 반영되는 것을 확인할 수 있습니다.

> HMR 기능이 모든 수정을 100% 반영해주지는 않습니다. Refresh를 해야하는 경우도 생깁니다.

## 빌드하기

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

위와 같이 npm script를 추가해줍니다.

- `zeroconfig web.build`: Webpack을 사용해서 웹브라우저에서 실행할 수 있는 결과물을 `dist/web/` 디렉토리로 빌드합니다.

```sh
$ npm run build
```

npm script를 실행합니다.

[![build](images/build.gif)](images/build.gif)
[![build](images/build.png)](images/build.png)

`dist/web/` 디렉토리에 js, html 파일들이 빌드된 것을 확인할 수 있습니다.

--------

## http-server로 빌드된 파일들을 확인해보기
빌드된 파일들이 정상적으로 동작하는지 확인해봅니다.

```sh
$ npm install -g http-server
```

Static Web Server를 간편하게 실행할 수 있는 `http-server`를 설치합니다.

```sh
$ cd dist/web
$ http-server . -p 9990
```

`dist/web/` 디렉토리로 이동한 다음, Port 9990으로 Web Server를 실행해봅니다.

[![http-server](images/http-server.gif)](images/http-server.gif)

<http://localhost:9990> 에 접속해서 확인할 수 있습니다.