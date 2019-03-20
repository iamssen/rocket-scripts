# Create a Client Side Rendering App

> ⚠️ I can not speak English well. It will be helpful if you correct the wrong expressions and send the PR. (If you have modified this document, please delete this comment.)

> The source codes for this document can be found at <https://github.com/iamssen/react-zeroconfig-sample.client-side-rendering>.

# Install

Initialize the project directory.

```sh
$ mkdir test
$ cd test
$ npm init
```

Install modules.

```sh
$ npm install react react-dom react-app-polyfill
$ npm install react-zeroconfig --save-dev
```

# Write code

Write simple “Hello World” codes.

The files to write.

- `src/_app/app.jsx`: The entry point of the app.
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

- `<script src="vendor.js"></script>`: This will include modules from the `node_modules/` Directory (eg. `react`, `react-dom`...)
- `<script src="app.js"></script>`: Created by the `src/_app/app.jsx` file.
  - `src/_app/{name}.jsx` → `{name}.js`

# Start test

Open the `package.json` file and add the npm scripts marked with `+` below.

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

- `zeroconfig web.dev.start`: Run the development server.

Run the npm script.

```sh
$ npm start
```

[![start](images/start.gif)](images/start.gif)

Open your web browser and connect to <http://localhost:3100>.

# Checking HMR (Hot Module Replacement) operation

`react-zeroconfig` supports HMR (Hot Module Replacement).

Open the file `src/_app/app.jsx` and modify the text "Hello World!".

[![hmr](images/hmr.gif)](images/hmr.gif)

You can see the changes are reflected in real time on the web browser.

> The HMR feature does not reflect 100% of all modifications. Refresh may also be required.

# Build

Open the `package.json` file and add the npm scripts marked with `+` below.

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

- `zeroconfig web.build`: Build the output to a `dist/web/` directory that can be run in web browsers.

Run the npm script.

```sh
$ npm run build
```

[![build](images/build.gif)](images/build.gif)
[![build](images/build.png)](images/build.png)

You can see that the js and html files are built in `dist/web/` directory.

--------

# Check the files built with http-server

Make sure that the built files are working properly.

Install `http-server` which can execute static web server easily.

```sh
$ npm install -g http-server
```

Running Web Server with port 9990.

```sh
$ cd dist/web
$ http-server ./dist/web -p 9990
```

You can check it by connecting to <http://localhost:9990>.

[![http-server](images/http-server.gif)](images/http-server.gif)
