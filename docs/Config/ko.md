# Config 옵션 설정 방법

`react-zeroconfig`를 설정합니다.

Config는 `package.json`에 입력하거나 `zeroconfig.config.js`, `zeroconfig.local.config.js`와 같은 파일로 만들어서 입력할 수 있습니다.

Config를 읽어내는 우선 순위는 아래와 같습니다.

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

# Config 옵션들

입력할 수 있는 Config의 종류는 아래와 같습니다.

```typescript
{
  app: {
    // Test Web Server의 Port
    port?: number = 3100;

    // Static File로 사용할 디렉토리들
    // `{static file directory}/test.png` → `{build root}/test.png`
    staticFileDirectories?: string[] = ['./public'];

    // 빌드 경로
    // build/path`와 같이 입력하는 경우 `{build root}/build/path/app.js`와 같이 빌드됨
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