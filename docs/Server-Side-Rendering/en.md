# Create a Server Side Rendering App

> ⚠️ I can not speak English well. It will be helpful if you correct the wrong expressions and send the PR. (If you have modified this document, please delete this comment.)

> The source codes for this document can be found at <https://github.com/iamssen/react-zeroconfig-sample.server-side-rendering>.

# Install

Initialize the project directory.

```sh
$ mkdir test
$ cd test
$ npm init
```

Install modules.

```sh
$ npm install react react-dom react-app-polyfill express
$ npm install react-zeroconfig multiplerun --save-dev
```

# Write code

Write simple “Hello World” codes.

The files to create.

- `src/app/index.jsx`: Main component of the app.
- `src/_app/app.jsx`: Entry point of the client app.
- `src/_server/index.jsx`: Entry point of the server app.

> The entry points are created for both client and server, so app main is made a separate component so that both entries can be used.

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

- `<script src="vendor.js"></script>`: This will include modules from the `node_modules/` Directory (eg. `react`, `react-dom`...)
- `<script src="app.js"></script>`: Created by the `src/_app/app.jsx` file.
  - `src/_app/{name}.jsx` → `{name}.js`

# Run test server

Open the `package.json` file and add the npm scripts marked with `+` below.

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


- `zeroconfig web.dev.start`: Run the development server.
- `zeroconfig web.server.dev.build.watch`: Constantly builds the `src/_server/index.jsx` file as the `dist-dev/server/index.js` file. (watch mode)
- `zeroconfig web.server.dev.start`: Run the `dist-dev/server/index.js` file using Nodemon and automatically rerun the update every time the file is updated.

It is very inconvenient to open the terminal windows to execute the above three scripts at the same time, so we use `multiplerun` to execute the scripts in a batch. <https://www.npmjs.com/package/multiplerun>

Run the npm script.

```sh
$ npm start
```

[![start](images/start.gif)](images/start.gif)

The above three npm scripts will be executed simultaneously.

> ⚠️ If you are using macOS and have iTerm installed, it will be opened using iTerm Split-Pane as above, otherwise there will be 3 terminals (Terminal.app or cmd.exe).

# Check in the web browser

First, make sure that Server Side Rendering is working normally.

Open your web browser and open <http://localhost:4100> and <view-source:localhost:4100>.

[![4100](images/4100.png)](images/4100.png)

Next, open and view <http://localhost:3100> and <view-source:localhost:3100>.

[![3100](images/3100.png)](images/3100.png)

To check whether the React Component works properly, press the button to confirm that the text changes.

[![click](images/click.gif)](images/click.gif)

# Build

Open the `package.json` file and add the npm scripts marked with `+` below.

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

- `zeroconfig web.build`: Build output that can be run in web browsers into the `dist/app/` directory.
- `zeroconfig web.server.build`: Build output that can be run in Node.js into the `dist/server/` directory.

Run the npm script.

```sh
$ npm run build
```

[![build](images/build.gif)](images/build.gif)
[![build](images/build.png)](images/build.png)

You can see the files built in `dist/web/` and `dist/server/` as above.

------

# Running built-in files using PM2, NginX

Try to build `dist/web/` and `dist/server/` in real environment.

Here is a simple summary of the implementation.

1. Can be run as `dist/server` Node.js
2. Connecting from `dist/web` web server to static file.
3. Connect Node.js(1) from Web Server(2) to Reverse Proxy.

> Based on macOS + Homebrew.

Install Node.js process manager `pm2` and `nginx`.

```sh
$ brew install nginx
$ npm install -g pm2
```

Run `dist/server/` with PM2.

```sh
$ cd dist/server
$ pm2 start index.js
```

[![pm2](images/pm2.gif)](images/pm2.gif)

You can check the execution at <http://localhost:4100>.

Add config to NginX.

```sh
$ cd /usr/local/etc/nginx/servers
$ nano test-server.conf
```

Create a `test-server.conf` file.

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

- `location ~ ^/(.*)\.(.*)$`: Catch all requests with extensions and connect them to static files. (Files with extensions such as `.xxx`, such as `x.png`, `y.html`)
- `location /`: All other requests are connected to the application executed in `pm2` through `proxy_pass http://127.0.0.1:$SSR_PORT`. (Reverse Proxy)

When you are finished, run NginX.

```sh
$ brew service start nginx
```

[![nginx](images/nginx.gif)](images/nginx.gif)

Open your web browser and check <http://localhost:8000>.