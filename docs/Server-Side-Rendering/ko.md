# Server Side Rendering

> 이 문서의 소스코드는 <https://github.com/iamssen/react-zeroconfig-sample.server-side-rendering>에서 확인할 수 있습니다.

## Install

```sh
$ mkdir test
$ cd test
$ npm init
```

프로젝트 디렉토리를 초기화하고

```sh
$ npm install react react-dom react-app-polyfill express
$ npm install react-zeroconfig multiplerun --save-dev
```

필요한 모듈들을 설치해줍니다

- `react`, `react-dom`: React
- `react-app-polyfill`: IE 지원을 위한 Polyfill
- `express`: Server Side Rendering을 위한 Server를 실행시킬 Express.js
- `react-zeroconfig`: Zeroconfig
- `multiplerun`: Server Side Rendering 테스트는 여러개의 Terminal 실행을 필요로 합니다. Terminal들을 일괄 실행하기 위해 필요한 모듈입니다.

## Code 작성하기

“Hello World” Code를 작성해봅니다.

```jsx
// {your-project-root}/src/app/index.jsx
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

```jsx
// {your-project-root}/src/_entry/app.jsx
import React from 'react';
import { hydrate } from 'react-dom';
import { App } from '../app';
import 'react-app-polyfill/ie11';

hydrate((
  <App initialState={window.__INITIAL_STATE__}/> 
), document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
```

```jsx
// {your-project-root}/src/_server/index.jsx
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

`node_modules` 디렉토리에 속한 `react`와 `react-dom` `react-app-polyfill`과 같은 라이브러리는
`<script src="vendor.js"></script>` 파일로 생성됩니다.

`src` 디렉토리에 속한 `_app/app.jsx` 파일은
`<script src="app.js"></script>` 파일로 생성됩니다.
(`_entry/{name}.jsx` 파일이 `<script src="{name}.js"></script>`로 생성되는 구조입니다)


## 테스트 실행

`package.json` 파일을 열어서, 아래에 `+`로 표시된 npm script를 추가해줍니다.

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

- `zeroconfig web.dev.start`: `webpack-dev-middleware`, `webpack-hot-middleware`, `browser-sync` 등을 조합해서 개발용 Server를 실행시킵니다.
- `zeroconfig web.server.dev.build.watch`: Webpack watch mode를 사용해서 `src/_server/index.jsx` 파일을 `dist-dev/server/index.js` 파일로 지속적으로 빌드합니다.
- `zeroconfig web.server.dev.start`: Nodemon을 사용해서 `dist-dev/server/index.js` 파일을 실행시키고, 업데이트가 있을때마다 자동으로 재실행 시킵니다.

위의 3개 Script를 동시에 실행시키기 위해서 Terminal 창을 일일히 여는 것은 굉장히 불편한 일이기 때문에 `multiplerun`을 사용해서 Script들을 일괄적으로 실행시킵니다. <https://www.npmjs.com/package/multiplerun>

```sh
$ npm start
```

npm script를 실행합니다.

[![start](images/start.gif)](images/start.gif)

위와 같이 3개의 npm script가 동시에 실행되게 됩니다. 

> macOS를 사용하고 있고, iTerm이 설치되어 있다면 위와 같이 iTerm Split-Pane을 사용해서 열리고, 그 외의 경우에는 Terminal(Terminal.app or cmd.exe)이 3개 뜨게 됩니다.

## 작동 확인

우선 Server Side Rendering이 정상적으로 되고 있는지 확인합니다.

웹브라우저를 열고 <http://localhost:4100>와 <view-source:localhost:4100>을 확인합니다.

[![4100](images/4100.png)](images/4100.png)

위와 같이 “Server Value”가 뜨면 성공입니다.

이번에는 <http://localhost:3100> 와 <view-source:localhost:3100>을 확인합니다.

[![3100](images/3100.png)](images/3100.png)

위와 같이 “Server Value”가 뜨면 성공입니다. 

[![click](images/click.gif)](images/click.gif)

React가 정상적으로 동작하는지 확인하기 위해서 Button을 눌러서 Text가 바뀌는 것을 확인합니다.

## 빌드하기

`package.json` 파일을 열어서, 아래 `+` 표시된 npm script를 추가합니다.

```diff
{
  "name": "test",
  "version": "1.0.0",
  "scripts": {
+    "web.build": "zeroconfig web.build",
    "web.dev.start": "zeroconfig web.dev.start",
+    "web.server.build": "zeroconfig web.server.build",
    "web.server.dev.build.watch": "zeroconfig web.server.dev.build.watch",
    "web.server.dev.start": "zeroconfig web.server.dev.start",
    "start": "multiplerun development",
+    "build": "npm run web.build && npm run web.server.build"
  },
  "multiplerun": {
    "development": [
      [
        "npm run web.server.dev.build.watch",
        "npm run web.server.dev.start"
      ],
      "npm run web.dev.start"
    ]
  },
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

- `zeroconfig web.build`: Webpack을 사용해서 웹브라우저에서 실행할 수 있는 결과물을 `/dist/app` 디렉토리로 빌드합니다.
- `zeroconfig web.server.build`: Webpack을 사용해서 Node.js에서 실행할 수 있는 결과물을 `/dist/server` 디렉토리로 빌드합니다.

```sh
$ npm run build
```

npm script를 실행합니다.

[![build](images/build.gif)](images/build.gif)
[![build](images/build.png)](images/build.png)

위와 같이 `dist/web/`과 `dist/server/`에 빌드된 파일들을 확인할 수 있습니다.

------

## 빌드된 파일들을 PM2, NginX를 사용해서 실행시키기

빌드된 `dist/web`과 `dist/server`를 실제 환경에서 실행시켜 봅니다. 

실행을 간단하게 정리하자면 아래와 같습니다.

1. `dist/server` Node.js로 실행할 수 있음
2. `dist/web` Web Server에서 Static File로 연결
3. Web Server(2)에서 Node.js(1)을 Reverse Proxy로 연결시킵니다.


> macOS + Homebrew를 기준으로 설명합니다.

```sh
$ brew install nginx
$ npm install -g pm2
```

Node.js Process Manager인 `pm2` 와 `nginx`를 설치해줍니다.

```sh
$ cd dist/server
$ pm2 start index.js
```

PM2로 `dist/server/`를 실행시켜 줍니다.

[![pm2](images/pm2.gif)](images/pm2.gif)

<http://localhost:4100> 에서 실행을 확인할 수 있습니다.

NginX에 Config를 추가해줍니다.

```sh
$ cd /usr/local/etc/nginx/servers
$ nano test-server.conf
```

`test-server.conf` 파일을 만듭니다.

```
server {
  set $STATIC_FILES /{your-project-root}/dist/web;
  set $SSR_PORT 4100;

  listen       8000;
  server_name  localhost;

  location / {
    proxy_redirect off;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy true;
    proxy_set_header Connection "";
    proxy_http_version 1.1;

    proxy_pass http://127.0.0.1:$SSR_PORT;
  }

  location ~ ^/(.*)\.(.*)$ {
    root $STATIC_FILES;
    autoindex off;
    expires off;
  }
}
```

- `location ~ ^/(.*)\.(.*)$`: 모든 확장자를 가진 Request는 Static File들을 호출하게 됩니다. 
- `location /`: 그 외의 모든 Request들은 `proxy_pass http://127.0.0.1:$SSR_PORT`를 통해서 `pm2`에서 실행된 Application으로 연결됩니다. (Reverse Proxy)

설정이 완료되었으면 NginX를 실행시킵니다.

```sh
$ brew service start nginx
```

[![nginx](images/nginx.gif)](images/nginx.gif)

웹브라우저를 열고 <http://localhost:8000> 을 확인합니다.