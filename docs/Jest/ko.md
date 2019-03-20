<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Jest로 Test 실행해보기](#jest%EB%A1%9C-test-%EC%8B%A4%ED%96%89%ED%95%B4%EB%B3%B4%EA%B8%B0)
- [Install](#install)
- [Config](#config)
- [Test Code 작성하고 실행해보기](#test-code-%EC%9E%91%EC%84%B1%ED%95%98%EA%B3%A0-%EC%8B%A4%ED%96%89%ED%95%B4%EB%B3%B4%EA%B8%B0)
- [Test File Match](#test-file-match)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Jest로 Test 실행해보기

Babel, Webpack 등 설정이 복잡하게 구성되어 있는 경우 Jest 설정 역시 복잡해지게 됩니다.

예를 들어 `import fileUrl from 'image.png'`와 같이 Webpack file-loader를 사용하게 되는 경우 별도의 Mock 처리를 해줘야하고,

Babel, Typescript 관련 설정을 Jest에도 별개로 해줘야 하기 때문에 번거로운 일이 됩니다.

`react-zeroconfig`는 Babel, Webpack에 관련된 설정을 미리 해둔 Jest Preset을 가지고 있어서 복잡한 설정없이 Jest Test를 실행할 수 있습니다.

# Install

프로젝트 디렉토리를 초기화하고

```sh
$ mkdir test
$ cd test
$ npm init
```

필요한 모듈들을 설치해줍니다.

```sh
$ npm install react-zeroconfig jest --save-dev 
```

# Config

`package.json` 파일을 열어서 `+`가 표시된 Jest 관련 설정들을 추가해줍니다.

```diff
{
  "name": "test",
  "version": "1.0.0",
  "scripts": {
+    "test": "jest"
  },
  "devDependencies": {
    "jest": "^24.5.0",
    "react-zeroconfig": "^2.0.6"
  },
+  "jest": {
+    "preset": "react-zeroconfig/configs"
+  }
}
```

`react-zeroconfig`에 미리 만들어져 있는 Jest Preset을 사용합니다. <https://github.com/iamssen/react-zeroconfig/blob/master/configs/jest-preset.js> 

`react-zeroconfig`의 Jest Preset을 사용하면 Webpack, Babel과 Jest의 설정이 달라서 발생하는 문제들에 신경쓰지 않아도 됩니다. 

# Test Code 작성하고 실행해보기

샘플 Test Case를 하나 만들어줍니다.

```js
// {your-project-root}/src/__test__/test.js
describe('Jest test', () => {
  it('Jest test should be run', () => {
    expect('abc').toEqual('abc');
  });
});
```

테스트를 실행해줍니다.

```sh
$ npm test
```

![test](images/test.gif)

# Test File Match

Jest 테스트에 Match 되는 파일들의 유형은 아래와 같습니다. <https://github.com/iamssen/react-zeroconfig/blob/master/configs/jest-preset.js#L13>

- `**/__tests?__/**/*.[jt]s?(x)`
    - OK `src/__tests__/a.js`
    - OK `src/__test__/a.tsx`
    - OK `src/a/b/__test__/c/d.ts`
    - NO `src/test/a.js`
- `**/?(*.)(spec|test).[jt]s?(x)`
    - OK `src/app/data/update.test.js` 
    - OK `src/app/components/Button.test.tsx`
    - NO `src/app/components/Button.tsx`