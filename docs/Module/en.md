<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Create modules](#create-modules)
- [`src/_modules/` directory rules](#src_modules-directory-rules)
- [Creating a new module](#creating-a-new-module)
- [Try the module you created inside the project](#try-the-module-you-created-inside-the-project)
- [Build the module](#build-the-module)
- [Try to publish the created module to NPM](#try-to-publish-the-created-module-to-npm)
- [⚠️ When the test is over, let's get rid of the garbage!](#-when-the-test-is-over-lets-get-rid-of-the-garbage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Create modules

> ⚠️ I can not speak English well. It will be helpful if you correct the wrong expressions and send the PR. (If you have modified this document, please delete this comment.)

> This example follows [Client Side Rendering](../Client-Side-Rendering/ko.md).

> The source codes for this document can be found at <https://github.com/iamssen/react-zeroconfig-sample.node-module>.

# `src/_modules/` directory rules

The `src/_modules/` directory is the directory where module can be created.

![directory-rule](images/directory-rule.png)

If you create a module called `_modules/iamssen-test-module` like above

```jsx
import React from 'react';
import TestComponent from 'iamssen-test-module';

export function App() {
  return (
    <div>
      <TestComponent/>
    </div>
  );
}
```

In this way, you can use the absolute path such as `import 'iamssen-test-module'` without having to import from relative paths like `import '../_modules/iamssen-test-module'` it will be possible.

The `src/_modules/` directory contains 2 main functions.

1. Import into an absolute path like `import '{your-module-name}'` in the project
2. Can build `src/_modules/` modules separately and publish them to NPM.

This helps to develop the **"common resources to be separated into modules after the project termination"** and **"the common resources that should be used in other projects currently underway at the same time"** in the course of the project.

# Creating a new module

Let's create a simple React component module.

First, you have to name the module you want to create.

> NPM publishing, so it should be possible to specify a name that will not be duplicated. (ex. `{your-github-id}-test-module`)

Create a simple Component.

```jsx
// {your-project-root}/src/_modules/{your-module-name}/index.jsx
import React from 'react';

export default function() {
  return <div style={{border: '10px solid black'}}>Hello, Module!</div>;
}
```

Create a `package.json` file for the module to use.

```json5
// {your-project-root}/src/_modules/{your-module-name}/package.json
{
  "name": "{your-module-name}",
  "version": "0.1.0",
  "main": "index.js",
  "dependencies": {
    "react": "^16.8.0"
  }
}
```

Since this is a React Component module, put `react` in `dependencies`.

> For `dependencies`, use SemVer(Semantic Versioning) like `^16.8.0`. This means that `^16.8.0` means `>= 16.8.0 < 17.0.0` which allows to install a version higher than or equals to `16.8.0` and lower than `17.0.0`. <https://www.npmjs.com/package/semver#caret-ranges-123-025-004> you can read more about this article. (SemVer is something you should know if you want to create and distribute modules)

Crate a `readme.md` file for the module to use.

```md
<!-- {your-project-root}/src/_modules/{your-module-name}/readme.md -->
# Hello, {your-module-name}

Description...
```

# Try the module you created inside the project

Modify the existing `src/_app/app.jsx` file and use the module you created.

```diff
import React from 'react';
import {render} from 'react-dom';
import 'react-app-polyfill/ie11';
+ import TestComponent from 'iamssen-test-module';

function App() {
  return (
+    <div>Hello World! <TestComponent/></div>
  );
}

render(<App/>, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
```

Run

```sh
$ npm start
```

![start](images/start.gif)

You can check that the module works normally by accessing <http://localhost:3100>.

# Build the module

Open the `package.json` file and add the npm scripts marked `+`.

```diff
{
  "name": "test",
  "version": "1.0.0",
  "scripts": {
+    "module.build": "zeroconfig module.build",
    "web.build": "zeroconfig web.build",
    "web.dev.start": "zeroconfig web.dev.start",
    "start": "npm run web.dev.start",
+    "build": "npm run web.build && npm run module.build"
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

Run build

```sh
$ npm run build
```

![start](images/build.gif)

You can see that the `dist/modules/{your-module-name}` directory has been created.

> If you only want to build the module,you can run it with `npm run module.build`.

# Try to publish the created module to NPM

To begin distributing to NPM, you must first register at <https://www.npmjs.com/>. Go to the site and signup.

When you are finished signing in, you must login to `npm`.

```sh
$ npm login
```
![login](images/login.gif)

If you have logged in to `npm`. open the `package.json` file and add the npm script marked `+`.

```diff
{
  "name": "test",
  "version": "1.0.0",
  "scripts": {
    "module.build": "zeroconfig module.build",
+    "module.publish": "zeroconfig module.publish",
    "web.build": "zeroconfig web.build",
    "web.dev.start": "zeroconfig web.dev.start",
    "start": "npm run web.dev.start",
    "build": "npm run web.build && npm run module.build"
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

Run

```sh
$ npm run module.publish
```

![publish](images/publish.gif)

If you run `module.publish`, you will be able to select the modules that is publishable (if it is not present on the NPM or higher than the last version distributed on the NPM), and when you have made your selection, it will start publishing to NPM.

If you get a message that the distribution is complete, go to `https://www.npmjs.com/package/{your-module-name}` and check that the module is properly published.

# ⚠️ When the test is over, let's get rid of the garbage!

We have published it as a test, but it is not good to put the test module on the NPM used by all developers.

```sh
$ npm unpublish {your-module-name} --force
```

Use `npm unpublish` to clear the test module.