<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Module 만들어보기](#module-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EA%B8%B0)
- [`src/_modules/` 디렉토리 규칙](#src_modules-%EB%94%94%EB%A0%89%ED%86%A0%EB%A6%AC-%EA%B7%9C%EC%B9%99)
- [새로운 Module 작성하기](#%EC%83%88%EB%A1%9C%EC%9A%B4-module-%EC%9E%91%EC%84%B1%ED%95%98%EA%B8%B0)
- [작성한 Module을 프로젝트 내부에서 사용해보기](#%EC%9E%91%EC%84%B1%ED%95%9C-module%EC%9D%84-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EB%82%B4%EB%B6%80%EC%97%90%EC%84%9C-%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EA%B8%B0)
- [작성한 Module을 빌드해보기](#%EC%9E%91%EC%84%B1%ED%95%9C-module%EC%9D%84-%EB%B9%8C%EB%93%9C%ED%95%B4%EB%B3%B4%EA%B8%B0)
- [작성한 Module을 NPM에 배포해보기](#%EC%9E%91%EC%84%B1%ED%95%9C-module%EC%9D%84-npm%EC%97%90-%EB%B0%B0%ED%8F%AC%ED%95%B4%EB%B3%B4%EA%B8%B0)
- [⚠️ 테스트가 끝났으면 쓰레기를 치웁시다!](#-%ED%85%8C%EC%8A%A4%ED%8A%B8%EA%B0%80-%EB%81%9D%EB%82%AC%EC%9C%BC%EB%A9%B4-%EC%93%B0%EB%A0%88%EA%B8%B0%EB%A5%BC-%EC%B9%98%EC%9B%81%EC%8B%9C%EB%8B%A4)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Module 만들어보기

> 이 예제는 [Client Side Rendering](../Client-Side-Rendering/ko.md)에서 이어집니다.

> 이 문서의 소스코드는 <https://github.com/iamssen/react-zeroconfig-sample.node-module>에서 확인할 수 있습니다.

# `src/_modules/` 디렉토리 규칙

`_modules/` 디렉토리는 Module을 작성할 수 있는 디렉토리 입니다.

![directory-rule](images/directory-rule.png)

위와 같이 `_modules/iamssen-test-module` 이라는 Module을 만들면

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

이렇게 프로젝트 내에서 `import '../_modules/iamssen-test-module'`과 같이 상대 경로를 통한 import를 할 필요없이, 바로 `import 'iamssen-test-module'`과 같은 절대 경로를 사용해서 불러올 수 있게 됩니다.

`_modules/` 디렉토리는 크게 2가지 기능을 수행해줍니다.

1. 프로젝트 내에서 `import '{your-module-name}'`과 같이 절대 경로로 불러오기
2. `_modules/`의 Module들을 별도로 빌드해서, NPM으로 퍼블리싱 할 수 있음

이는 프로젝트를 진행하는 과정에서 **"차후 프로젝트 종료 이후에 Module로 분리시킬 공통 자원"**이나 **"현재 동시에 진행되고 있는 다른 프로젝트에서 사용해야 하는 공용 자원"**을 프로젝트 내부에서 개발하고, 외부로 분리시켜서 퍼블리싱 하는데 도움을 줍니다.

# 새로운 Module 작성하기

간단한 React Component Module을 작성해봅시다.

우선 작성할 Module을 이름을 정해야 합니다.

> NPM 퍼블리싱까지 해볼 것이기 때문에, 가능한 중복되지 않을 이름으로 정하도록 합니다. (ex. `{your-github-id}-test-module`)

간단한 Component를 작성해줍니다.

```jsx
// {your-project-root}/src/_modules/{your-module-name}/index.jsx
import React from 'react';

export default function() {
  return <div style={{border: '10px solid black'}}>Hello, Module!</div>;
}
```

Module이 사용할 `package.json` 파일을 만들어줍니다.

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

React Component Module이기 때문에 `dependencies`에 `react`를 넣습니다.

> `dependencies` 같은 경우 `^16.8.0` 과 같이 SemVer(Semantic Versioning)을 사용하도록 합니다. 의미를 간단히 설명하자면 `^16.8.0`은 `>= 16.8.0 < 17.0.0` 으로 `16.8.0` 에서 `17.0.0` 이전까지의 Version을 설치할 수 있게 허용한다는 의미 입니다. https://www.npmjs.com/package/semver#caret-ranges-123-025-004 이 문서를 참고해서 좀 더 자세히 알아볼 수 있습니다. (SemVer는 Module을 만들어서 배포하려 한다면 꼭 알아둬야할 사항입니다)

Module의 `readme.md` 파일을 만들어줍니다.

```md
<!-- {your-project-root}/src/_modules/{your-module-name}/readme.md -->
# Hello, {your-module-name}

Description...
```

# 작성한 Module을 프로젝트 내부에서 사용해보기

기존 `src/_app/app.jsx` 파일을 수정해서, 작성한 Module을 사용해봅시다.

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

프로젝트를 실행합니다.

```sh
$ npm start
```

![start](images/start.gif)

<http://localhost:3100>에 접속해서 Module이 정상적으로 동작하는 것을 확인할 수 있습니다.

# 작성한 Module을 빌드해보기

`package.json` 파일을 열어서 `+` 표시된 npm script를 추가해줍니다.

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

빌드를 실행해봅니다.

```sh
$ npm run build
```

![start](images/build.gif)

`dist/modules/{your-module-name}` 디렉토리가 생성된 것을 확인할 수 있습니다.

> Module 빌드만 원할때는 `npm run module.build`로 실행할 수 있습니다.

# 작성한 Module을 NPM에 배포해보기

우선 NPM에 배포를 하기 위해서는 https://www.npmjs.com/ 에 가입을 해야 합니다. 사이트에 들어가서 가입을 해둡니다.

가입을 완료했으면 `npm`에 Login을 해야 합니다.

```sh
$ npm login
```
![login](images/login.gif)

`npm` 로그인이 완료되었으면 이제 `package.json` 파일을 열어서 `+` 표시된 npm script를 추가해줍니다.

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

실행해줍니다.

```sh
$ npm run module.publish
```

![publish](images/publish.gif)

`module.publish`를 실행하면 배포 가능한 (NPM 상에 존재하지 않거나, NPM 상에 배포된 마지막 Version보다 높은 경우) Module을 선택할 수 있고 (`space` key), 선택을 완료하면 (`enter` key) NPM에 배포를 시작합니다.

배포가 완료되었다는 메세지가 나오면 `https://www.npmjs.com/package/{your-module-name}`으로 접속해서 Module이 정상적으로 배포되었는지 확인해줍니다.

# ⚠️ 테스트가 끝났으면 쓰레기를 치웁시다!

테스트로 퍼블리싱을 했지만, 모든 개발자들이 사용하는 NPM에 테스트 Module을 올려두는 것은 좋지 않은 일입니다.

```sh
$ npm unpublish {your-module-name} --force
```

`npm unpublish`를 사용해서 Module을 지워주도록 합니다.