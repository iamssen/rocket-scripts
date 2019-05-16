# Unit Test

- internalPackage
  - getInternalPackageEntry
    - src/_packages 에 있는 directory를 읽어내서 entry를 가져온다 (fixture:default-packages)
    - src/_packages 에 directory가 없을 경우 빈 array를 entry로 받는다 (fixture:empty-packages)
    - src/_packages/@something/* directory를 읽어내서 entry를 가져온다 (fixture:grouped-packages)
  - getInternalPackagePublicDirectories
    - src/_packages/* 에 있는 public directory를 읽어내서 path들을 array로 가져온다 (fixture:default-packages)
    - public directory가 없는 경우 빈 array를 받는다 (fixture:empty-packages)
    - src/_packages/@something/* 에 있는 public directory를 읽어내서 array로 가져온다 (fixture:grouped-packages)
- runners
  - buildTypescriptDeclarations
    - packages 디렉토리의 특정 file을 빌드해서 d.ts 파일들을 만들어낸다 (dist 디렉토리의 d.ts 파일의 glob 리스트를 테스트)
      - 이 case를 여러개 테스트한다
  - copyServerPackageJson
    - package.json 을 일어내서 copy 해본다 (워낙 단순한 기능이라 특별히 많은 테스트를 거칠 필요는 없을듯)
  - fsCopySourceFilter
    - package directory를 copy 해본다 (glob으로 리스트를 테스트)
      - 이 case를 여러개 테스트한다
  - runWebpack
  - watchWebpack
  - watingFiles
    - tmp 디렉토리를 만들고, wating을 건 다음, 5초후에 파일을 만들어서 종료시킨다
- transpile
  - getBabelConfig
    - 만들고 presets, plugins, overrides 가 있는지 확인
    - module이 정상적으로 입력되었는지 확인
  - getBrowserslistQuery
    - 기본값 확인
    - package.json 에 선언된 다른 값들을 확인 (fixture:custom-browserslist)
  - getPackageJsonContentsOrderedNames
    - 기본 package.json 값들을 넣어서 확인
    - 실제 directory를 읽어서 값들을 확인 (fixture:default-packages, fixture:grouped-packages)
  - getTSConfigCompilerOptions
    - TS 프로젝트들의 Compiler 옵션을 가져와서 확인 (fixture:simple-csr-ts, fixture:simple-ssr-ts...)
    - Custom하게 처리된 Compiler 옵션을 가져와서 확인 (fixture:custom-tsconfig)
- utils
  - createTmpDirectory
    - 기본 가져와서 stats.isDirectory() 체크
  - createTmpFixture
    - 가져와서 stats.isDirectory() 확인하고 구성 파일들 glob으로 확인
  - takeMinimistEveryValues, takeMinimistLatestValue


# E2E Test

- simple csr 테스트
  - size-report.html 정상적으로 생성되었나 확인
  - dist/*/browser
    - public directory가 정상적으로 복제 되었는지 확인
    - app.js... 등 파일이 정상적으로 생성되었는지 확인
- simple ssr 테스트
  - loadable-stats.json 정상적으로 생성되었나 확인
  - dist/*/server
    - index.js... 등 파일이 정상적으로 생성되었는지 확인
    
- e2e
  - zeroconfig-webapp-scripts build app
    - default case
      - fixture 복사
      - exec (npm install)
      - exec (zeroconfig-webapp-scripts build app)
      - glob 으로 결과물 파일 검사
    - cases
      - mode production -> dist 디렉토리 검사
      - mode development -> .dev 디렉토리 검사
      - output -> 별도의 디렉토리 검사
  - zeroconfig-webapp-scripts start app
    - fixture 복사
    - exec (npm install)
    - exec (zeroconfig-webapp-scripts start app) -> child process
    - localhost:4100 의 http status code 가 200인지 확인
    - localhost:3100 의 http status code 가 200인지 확인
    - child process 종료
  - zeroconfig-package-scripts build
    - fixture 복사
    - exec (npm install)
    - exec (zeroconfig-package-scripts build)
    - glob 으로 결과물 파일 검사

# Fixtures
- packages : 여러 entry가 존재
- ~~packages-empty : 빈 entry~~ -> 다른 빈 fixture를 사용
- packages-grouped : @group/{name}과 같은 entry가 존재
- custom-browserslist
- custom-tsconfig