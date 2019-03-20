<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Server Side Rendering App 만들어보기](#server-side-rendering-app-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EA%B8%B0)
- [Install](#install)
- [Code 작성하기](#code-%EC%9E%91%EC%84%B1%ED%95%98%EA%B8%B0)
- [테스트 실행](#%ED%85%8C%EC%8A%A4%ED%8A%B8-%EC%8B%A4%ED%96%89)
- [웹브라우저에서 작동 확인해보기](#%EC%9B%B9%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EC%97%90%EC%84%9C-%EC%9E%91%EB%8F%99-%ED%99%95%EC%9D%B8%ED%95%B4%EB%B3%B4%EA%B8%B0)
- [빌드하기](#%EB%B9%8C%EB%93%9C%ED%95%98%EA%B8%B0)
- [빌드된 파일들을 PM2, NginX를 사용해서 실행시키기](#%EB%B9%8C%EB%93%9C%EB%90%9C-%ED%8C%8C%EC%9D%BC%EB%93%A4%EC%9D%84-pm2-nginx%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%B4%EC%84%9C-%EC%8B%A4%ED%96%89%EC%8B%9C%ED%82%A4%EA%B8%B0)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Server Side Rendering App 만들어보기

> 이 문서의 소스코드는 <https://github.com/iamssen/react-zeroconfig-sample.server-side-rendering>에서 확인할 수 있습니다.

# Install

프로젝트 디렉토리를 초기화하고

```sh
$ mkdir test
$ cd test
$ npm init
```

필요한 모듈들을 설치해줍니다

```sh
$ npm install react react-dom react-app-polyfill express
$ npm install react-zeroconfig multiplerun --save-dev
```

# Code 작성하기

간단한 “Hello World” Code를 작성해봅니다.

작성할 파일들입니다.

- `src/app/index.jsx`: App의 Main Component 입니다.
- `src/_app/app.jsx`: Client App의 Entry point 입니다.
- `src/_server/index.jsx`: Server App의 Entry point 입니다.

> Client와 Server 양쪽으로 Entry point가 생기기 때문에 App Main을 별도의 Component로 분리했습니다.

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
// {your-project-root}/src/_app/app.jsx
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

- `<script src="vendor.js"></script>`: `node_modules/` 디렉토리의 모듈들이 포함되게 됩니다 (ex. `react`, `react-dom`...)
- `<script src="app.js"></script>`: `src/_app/app.jsx` 파일에 의해 만들어집니다
  - `src/_app/{name}.jsx` → `{name}.js`

# 테스트 실행

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

- `zeroconfig web.dev.start`: 개발용 Server를 실행시킵니다.
- `zeroconfig web.server.dev.build.watch`: `src/_server/index.jsx` 파일을 `dist-dev/server/index.js` 파일로 지속적으로 빌드합니다. (Watch Mode)
- `zeroconfig web.server.dev.start`: Nodemon을 사용해서 `dist-dev/server/index.js` 파일을 실행시키고, 해당 파일의 업데이트가 있을때마다 자동으로 재실행 시킵니다.

위의 3개 Script를 동시에 실행시키기 위해서 Terminal 창을 일일히 여는 것은 굉장히 불편한 일이기 때문에 `multiplerun`을 사용해서 Script들을 일괄적으로 실행시킵니다. <https://www.npmjs.com/package/multiplerun>

npm script를 실행합니다.

```sh
$ npm start
```

[![start](images/start.gif)](images/start.gif)

위와 같이 3개의 npm script가 동시에 실행되게 됩니다. 

> ⚠️ macOS를 사용하고 있고, iTerm이 설치되어 있다면 위와 같이 iTerm Split-Pane을 사용해서 열리고, 그 외의 경우에는 Terminal(Terminal.app or cmd.exe)이 3개 뜨게 됩니다.

# 웹브라우저에서 작동 확인해보기

우선 Server Side Rendering이 정상적으로 되고 있는지 확인합니다.

웹브라우저를 열어서 <http://localhost:4100>와 <view-source:localhost:4100>을 열어서 확인합니다.

[![4100](images/4100.png)](images/4100.png)

다음으로 <http://localhost:3100> 와 <view-source:localhost:3100>을 열어서 확인합니다.

[![3100](images/3100.png)](images/3100.png) 

React Component가 정상적으로 동작하는지 확인하기 위해서 Button을 눌러서 Text가 바뀌는 것을 확인합니다.

[![click](images/click.gif)](images/click.gif)

# 빌드하기

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

- `zeroconfig web.build`: 웹브라우저에서 실행할 수 있는 결과물을 `/dist/app/` 디렉토리로 빌드합니다.
- `zeroconfig web.server.build`: Node.js에서 실행할 수 있는 결과물을 `/dist/server/` 디렉토리로 빌드합니다.

npm script를 실행합니다.

```sh
$ npm run build
```

[![build](images/build.gif)](images/build.gif)
[![build](images/build.png)](images/build.png)

위와 같이 `dist/web/` 디렉토리와 `dist/server/` 디렉토리에서 빌드된 파일들을 확인할 수 있습니다.

------

# 빌드된 파일들을 PM2, NginX를 사용해서 실행시키기

빌드된 `dist/web/`과 `dist/server/`를 실제 환경에서 실행시켜 봅니다. 

실행을 간단하게 정리하자면 아래와 같습니다.

1. `dist/server/` Node.js로 실행할 수 있음
2. `dist/web/` Web Server에서 Static File로 연결
3. Web Server(2)에서 Node.js(1)을 Reverse Proxy로 연결시킵니다.

> macOS + Homebrew를 기준으로 설명합니다.

Node.js Process Manager인 `pm2` 와 `nginx`를 설치해줍니다.

```sh
$ brew install nginx
$ npm install -g pm
```

PM2로 `dist/server/`를 실행시켜 줍니다.

```sh
$ cd dist/server
$ pm2 start index.js
```

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

1. `location ~ ^/(.*)\.(.*)$`: 모든 확장자를 가진 Request들을 캐치해서 Static File들로 연결합니다. (`x.png`, `y.html`과 같이 `.xxx` 같은 확장자를 가진 파일들) 
2. `location /`: 그 외의 모든 Request들은 `proxy_pass http://127.0.0.1:$SSR_PORT`를 통해서 `pm2`에서 실행된 Application으로 연결됩니다. (Reverse Proxy)

설정이 완료되었으면 NginX를 실행시킵니다.

```sh
$ brew service start nginx
```

[![nginx](images/nginx.gif)](images/nginx.gif)

웹브라우저를 열고 <http://localhost:8000> 을 확인합니다.