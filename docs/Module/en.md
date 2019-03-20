<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Module 만들어보기](#module-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EA%B8%B0)
- [`src/_modules/` 디렉토리 규칙](#src_modules-%EB%94%94%EB%A0%89%ED%86%A0%EB%A6%AC-%EA%B7%9C%EC%B9%99)
- [새로운 Module 작성하기](#%EC%83%88%EB%A1%9C%EC%9A%B4-module-%EC%9E%91%EC%84%B1%ED%95%98%EA%B8%B0)
- [작성한 Module을 프로젝트 내부에서 사용해보기](#%EC%9E%91%EC%84%B1%ED%95%9C-module%EC%9D%84-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EB%82%B4%EB%B6%80%EC%97%90%EC%84%9C-%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EA%B8%B0)
- [작성한 Module을 빌드해보기](#%EC%9E%91%EC%84%B1%ED%95%9C-module%EC%9D%84-%EB%B9%8C%EB%93%9C%ED%95%B4%EB%B3%B4%EA%B8%B0)
- [작성한 Module을 NPM에 배포해보기](#%EC%9E%91%EC%84%B1%ED%95%9C-module%EC%9D%84-npm%EC%97%90-%EB%B0%B0%ED%8F%AC%ED%95%B4%EB%B3%B4%EA%B8%B0)
- [⚠️ 테스트가 끝났으면 쓰레기를 치웁시다!](#-%ED%85%8C%EC%8A%A4%ED%8A%B8%EA%B0%80-%EB%81%9D%EB%82%AC%EC%9C%BC%EB%A9%B4-%EC%93%B0%EB%A0%88%EA%B8%B0%EB%A5%BC-%EC%B9%98%EC%9B%81%EC%8B%9C%EB%8B%A4)

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