<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [`react-zeroconfig` 설정 방법](#react-zeroconfig-%EC%84%A4%EC%A0%95-%EB%B0%A9%EB%B2%95)
- [예제](#%EC%98%88%EC%A0%9C)
- [옵션들](#%EC%98%B5%EC%85%98%EB%93%A4)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# `react-zeroconfig` 설정 방법

설정은 `package.json`에 입력하거나 `zeroconfig.config.js`, `zeroconfig.local.config.js`와 같은 파일로 만들어서 입력할 수 있습니다.

설정을 읽어내는 우선 순위는 아래와 같습니다.

1. `zeroconfig.local.config.js`
2. `zeroconfig.config.js`
3. `package.json`의 `zeroconfig` 항목

# 예제 

```diff
{
  "name": "some-project",
+  "zeroconfig": {
+    "app": {
+      "port": 7777
+    }
+  }
}
```

`package.json` 파일에 위처럼 `zeroconfig` 옵션을 설정하면, Test Server가 <http://localhost:7777>로 열리게 됩니다.

# 옵션들

설정할 수 있는 옵션의 종류는 아래와 같습니다.

```typescript
{
  app: {
    // Test Web Server의 Port
    port?: number = 3100;

    // Static File로 사용할 디렉토리들
    // `{static file directory}/test.png` → `{build root}/test.png`
    staticFileDirectories?: string[] = ['./public'];

    // 빌드 경로
    // `build/path`와 같이 입력하는 경우 `{build root}/build/path/app.js`와 같이 빌드됨
    buildPath?: string = '';

    // Test Server를 https로 설정
    // https://browsersync.io/docs/options#option-https
    https?: boolean | {key: string, cert: string} = false;

    // Vendor Chunk File의 이름
    vendorFileName?: string = 'vendor';

    // Style File의 이름
    styleFileName?: string = 'style';

    // Webpack `publicPath`
    // https://webpack.js.org/guides/public-path/
    publicPath?: string = '';

    // Test SSR Server의 Port
    serverPort?: number = 4100;
  }
}
```

더 자세한 옵션들은 <https://github.com/iamssen/react-zeroconfig/blob/master/src/types.ts#L6> 파일에서 확인할 수 있습니다.