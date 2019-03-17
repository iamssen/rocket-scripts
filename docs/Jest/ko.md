# Run test with Jest

## Install

```sh
$ mkdir test
$ cd test
$ npm init
```

프로젝트 디렉토리를 초기화하고

```sh
$ npm install react-zeroconfig jest --save-dev 
```

필요한 모듈들을 설치해줍니다.

## Config

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

`react-zeroconfig`에 미리 만들어져 있는 Jest Preset을 사용하면 됩니다. <https://github.com/iamssen/react-zeroconfig/blob/master/configs/jest-preset.js> 

`react-zeroconfig`의 Jest Preset을 사용하면 Webpack, Babel과 Jest의 설정이 달라서 발생하는 문제들에 신경쓰지 않아도 됩니다. 

## Test Code 작성하고 실행해보기

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

## Test File Match

Jest 테스트에 Match 되는 파일들의 유형은 아래와 같습니다. <https://github.com/iamssen/react-zeroconfig/blob/master/configs/jest-preset.js#L13>

- `**/__tests?__/**/*.[jt]s?(x)`
    - `src/__tests__/a.js` 
    - `src/__test__/a.tsx`
    - `src/a/b/__test__/c/d.ts`
- `**/?(*.)(spec|test).[jt]s?(x)`
    - `src/app/data/update.test.js` 
    - `src/app/components/Button.test.tsx`