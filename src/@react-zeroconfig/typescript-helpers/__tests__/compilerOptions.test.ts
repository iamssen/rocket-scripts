/* eslint-disable @typescript-eslint/typedef */
import {
  ImportsNotUsedAsValues,
  JsxEmit,
  MapLike,
  ModuleKind,
  ModuleResolutionKind,
  NewLineKind,
  ScriptTarget,
} from 'typescript';

// 3.8.3
interface CompilerOptions {
  allowJs?: boolean;
  allowSyntheticDefaultImports?: boolean;
  allowUmdGlobalAccess?: boolean;
  allowUnreachableCode?: boolean;
  allowUnusedLabels?: boolean;
  alwaysStrict?: boolean;
  baseUrl?: string;
  charset?: string;
  checkJs?: boolean;
  declaration?: boolean;
  declarationMap?: boolean;
  emitDeclarationOnly?: boolean;
  declarationDir?: string;
  disableSizeLimit?: boolean;
  disableSourceOfProjectReferenceRedirect?: boolean;
  disableSolutionSearching?: boolean;
  downlevelIteration?: boolean;
  emitBOM?: boolean;
  emitDecoratorMetadata?: boolean;
  experimentalDecorators?: boolean;
  forceConsistentCasingInFileNames?: boolean;
  importHelpers?: boolean;
  importsNotUsedAsValues?: ImportsNotUsedAsValues;
  inlineSourceMap?: boolean;
  inlineSources?: boolean;
  isolatedModules?: boolean;
  jsx?: JsxEmit;
  keyofStringsOnly?: boolean;
  lib?: string[];
  locale?: string;
  mapRoot?: string;
  maxNodeModuleJsDepth?: number;
  module?: ModuleKind;
  moduleResolution?: ModuleResolutionKind;
  newLine?: NewLineKind;
  noEmit?: boolean;
  noEmitHelpers?: boolean;
  noEmitOnError?: boolean;
  noErrorTruncation?: boolean;
  noFallthroughCasesInSwitch?: boolean;
  noImplicitAny?: boolean;
  noImplicitReturns?: boolean;
  noImplicitThis?: boolean;
  noStrictGenericChecks?: boolean;
  noUnusedLocals?: boolean;
  noUnusedParameters?: boolean;
  noImplicitUseStrict?: boolean;
  assumeChangesOnlyAffectDirectDependencies?: boolean;
  noLib?: boolean;
  noResolve?: boolean;
  out?: string;
  outDir?: string;
  outFile?: string;
  paths?: MapLike<string[]>;
  preserveConstEnums?: boolean;
  preserveSymlinks?: boolean;
  project?: string;
  reactNamespace?: string;
  jsxFactory?: string;
  composite?: boolean;
  incremental?: boolean;
  tsBuildInfoFile?: string;
  removeComments?: boolean;
  rootDir?: string;
  rootDirs?: string[];
  skipLibCheck?: boolean;
  skipDefaultLibCheck?: boolean;
  sourceMap?: boolean;
  sourceRoot?: string;
  strict?: boolean;
  strictFunctionTypes?: boolean;
  strictBindCallApply?: boolean;
  strictNullChecks?: boolean;
  strictPropertyInitialization?: boolean;
  stripInternal?: boolean;
  suppressExcessPropertyErrors?: boolean;
  suppressImplicitAnyIndexErrors?: boolean;
  target?: ScriptTarget;
  traceResolution?: boolean;
  resolveJsonModule?: boolean;
  types?: string[];
  /** Paths used to compute primary types search locations */
  typeRoots?: string[];
  esModuleInterop?: boolean;
  useDefineForClassFields?: boolean;
}

// https://github.com/babel/babel/blob/master/packages/babel-parser/src/plugins/typescript/index.js
// https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/scripts/utils/verifyTypeScriptSetup.js#L94

describe('@react-zeroconfig/typescript-helpers', () => {
  test('compilerOptions', () => {
    type CompilerOptionsKeys = keyof CompilerOptions;

    // Zeroconfig에 의해 고정된 설정들
    const fixed = {
      // https://www.typescriptlang.org/tsconfig#allowJs
      // Zeroconfig 기본 설정 - js cross import 가능
      allowJs: true,

      // https://www.typescriptlang.org/tsconfig#downlevelIteration
      // https://babeljs.io/docs/en/babel-plugin-transform-typescript#typescript-compiler-options
      // @babel/preset-env 에서 허용됨
      downlevelIteration: true,

      // https://www.typescriptlang.org/tsconfig#jsx
      // Zeroconfig 기본 설정 - jsx react
      jsx: 'react',

      // https://www.typescriptlang.org/tsconfig#module
      // https://babeljs.io/docs/en/babel-plugin-transform-typescript#onlyremovetypeimports
      // Webpack, Zeroconfig 에 의해 결정됨
      module: 'esnext',

      // https://www.typescriptlang.org/tsconfig#reactNamespace
      // Zeroconfig 기본 설정 - jsx react
      reactNamespace: 'React',

      // https://www.typescriptlang.org/tsconfig#jsxFactory
      // Zeroconfig 기본 설정 - jsx react
      jsxFactory: 'React',
    };

    // IDE 지원을 위해 사용자에 의해 필수적으로 입력되어야 하는 설정들
    const required = {
      // https://www.typescriptlang.org/tsconfig#baseUrl
      // Zeroconfig 기본 디렉토리 Rule
      baseUrl: 'src',

      // https://www.typescriptlang.org/tsconfig#paths
      // Zeroconfig 기본 디렉토리 Rule
      // TODO extends 가 되는지 확인하고, fixed로 이동
      paths: { '*': ['_packages/*', '*'] },
    } as const;

    // 사용자 설정에 따라 달라짐
    const optional = {
      // https://www.typescriptlang.org/tsconfig#checkJs
      // allowJs: true 시에 js type check 수행
      // 특별히 js를 까다롭게 check할 이유가 없다
      checkJs: false,

      // https://www.typescriptlang.org/tsconfig#allowSyntheticDefaultImports
      // import React from 'react' 와 같은 default import 허용
      allowSyntheticDefaultImports: true,

      // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-8.html#unused-labels
      // 사용하지 않음 - typescript 기본값
      allowUnusedLabels: false,

      // https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues
      // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-exports
      // https://babeljs.io/docs/en/babel-plugin-transform-typescript#onlyremovetypeimports
      // 사용되지 않은 import를 어떻게 처리할지 결정
      importsNotUsedAsValues: 'remove',

      // https://www.typescriptlang.org/tsconfig#lib
      // Browserslist와 연관됨
      // TODO 몇 가지 Preset 문서를 작성해둘 필요가 있음 (browserslist + tsconfig.lib + polyfill 설정을 일괄적으로...)
      lib: [],

      // https://www.typescriptlang.org/tsconfig#noLib
      // true로 설정하면 lib 가 무시됨
      // Browserslist에 연관되기 때문에 큰 의미는 없지만, IDE 작동을 위한 옵션이 될듯...
      noLib: false,

      // https://www.typescriptlang.org/docs/handbook/compiler-options.html
      // The locale to use to show error messages, e.g. en-us.
      // Possible values are:
      // ► English (US): en
      // ► Czech: cs
      // ► German: de
      // ► Spanish: es
      // ► French: fr
      // ► Italian: it
      // ► Japanese: ja
      // ► Korean: ko
      // ► Polish: pl
      // ► Portuguese(Brazil): pt-BR
      // ► Russian: ru
      // ► Turkish: tr
      // ► Simplified Chinese: zh-CN
      // ► Traditional Chinese: zh-TW
      locale: 'en-us',

      // https://www.typescriptlang.org/tsconfig#noFallthroughCasesInSwitch
      // linter checks
      // break, return이 없는 case를 경고한다
      // eslint 때문에 굳이 사용할 필요는 없어보이지만...
      noFallthroughCasesInSwitch: false,

      // https://www.typescriptlang.org/tsconfig#noImplicitAny
      // any 금지
      // eslint 로 any를 체크하기 때문에 좀 애매하지만...
      noImplicitAny: true,

      // https://www.typescriptlang.org/tsconfig#noImplicitReturns
      // () => string / return condition ? 'x' : 1 과 같이 return type을 체크
      noImplicitReturns: true,

      // https://www.typescriptlang.org/tsconfig#noImplicitThis
      // 모호한 this type을 체크
      noImplicitThis: true,

      // https://www.typescriptlang.org/tsconfig#noStrictGenericChecks
      // type A = <T, U>(x: T, y: U) => [T, U];
      // type B = <S>(x: S, y: S) => [S, S];
      // A = B 로 체크하게 되는 등 generic check를 약화시킨다
      noStrictGenericChecks: false,

      // https://www.typescriptlang.org/tsconfig#noUnusedLocals
      // 사용하지 않는 local variable을 검사한다
      // eslint 때문에 활성화 시킬 필요는 없을듯...
      noUnusedLocals: false,

      // https://www.typescriptlang.org/tsconfig#noUnusedParameters
      // 사용하지 않는 parameters 검사
      // eslint 때문에 활성화 시킬 필요 없을듯
      noUnusedParameters: false,

      // https://www.typescriptlang.org/tsconfig#assumeChangesOnlyAffectDirectDependencies
      // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#fast-and-loose-incremental-checking
      // watch 시에 target이 되는 file들을 changed된 파일만 대상으로 하게됨 (recheck 안함)
      // fork-ts-checker에서 사용될런지는 모르겠지만... 어쨌든...;;;
      // watch, start 시에는 option을 사용하고,
      // build 시에는 false로 놓는게 좋을 것 같다.
      // TODO fork-ts-checker 에서 tsconfig를 바로 사용하지 말고, 읽어들여서 filtering 한 다음에 사용해야 할듯...;;;
      assumeChangesOnlyAffectDirectDependencies: true,

      // https://www.typescriptlang.org/tsconfig#skipLibCheck
      // 음... 아마도 import 로 가져온 부분만 검사하는듯 싶다.
      // d.ts 파일 전체를 검사하지 않겠다는 의미의 skip인듯...
      // true로 설정되어야 할 것 같다.
      skipLibCheck: true,

      // https://www.typescriptlang.org/tsconfig#forceConsistentCasingInFileNames
      // 대소문자를 구분하는 시스템에서 Cache에 관여한다
      // babel에서 사용하지 않을듯?
      // TODO 확인 필요
      forceConsistentCasingInFileNames: true,

      // https://www.typescriptlang.org/tsconfig#strict
      // noImplicitAny -> 이게 ESLint와 겹쳐서 좀 애매하긴 한데...;;;
      // noImplicitThis
      // alwaysStrict
      // strictBindCallApply
      // strictNullChecks
      // strictFunctionTypes
      // strictPropertyInitialization
      strict: true,
      // param types 반공변성
      strictFunctionTypes: true,
      strictBindCallApply: true,
      strictNullChecks: true,
      strictPropertyInitialization: true,
    } as const;

    // 사용자가 설정해도 무시됨
    const ignored = {
      // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#new---alwaysstrict
      // js 파일에 'use strict' 붙임
      // babel에서 관리됨 - parserOpts: { strictMode: true }
      alwaysStrict: false,

      // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-5.html#the---allowumdglobalaccess-flag
      // UMD Library를 사용하지 않는다
      allowUmdGlobalAccess: false,

      // https://www.typescriptlang.org/tsconfig#charset
      // Deprecated. UTF8 이외의 Charset 지원하지 않음
      charset: 'utf8',

      // https://www.typescriptlang.org/tsconfig#declaration
      // Zeroconfig가 제어하는 옵션 - d.ts 파일 생성 여부
      declaration: false,

      // https://www.typescriptlang.org/tsconfig#declarationMap
      // Zeroconfig가 제어하는 옵션 - d.ts.map 파일 생성 여부
      declarationMap: false,

      // https://www.typescriptlang.org/tsconfig#emitDeclarationOnly
      // Zeroconfig가 제어하는 옵션 - js 파일을 만들지 않고, d.ts 파일만 만듬
      emitDeclarationOnly: false,

      // https://www.typescriptlang.org/tsconfig#declarationDir
      // Zeroconfig가 제어하는 옵션 - d.ts 파일을 생성하는 디렉토리
      declarationDir: undefined,

      // https://www.typescriptlang.org/tsconfig#disableSizeLimit
      // https://github.com/microsoft/TypeScript/issues/7444#issuecomment-197064666
      // 사용되지 않음 - tsc에서 너무 많은 파일들이 대상이 되어서 Memory Issue가 발생할 때, exclude로 대상을 제외하거나, 이 옵션을 사용
      disableSizeLimit: false,

      // https://www.typescriptlang.org/tsconfig#disableSourceOfProjectReferenceRedirect
      // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#build-free-editing-with-project-references
      // 사용되지 않음 - Project Refrerence 관련
      disableSourceOfProjectReferenceRedirect: false,

      // https://www.typescriptlang.org/tsconfig#disableSolutionSearching
      // 사용되지 않음 - Project Reference 관련
      disableSolutionSearching: false,

      // https://www.typescriptlang.org/tsconfig#emitBOM
      // babel로 보내기 때문에 특별히 입력할 이유가 없음
      emitBOM: false,

      // https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata
      // https://babeljs.io/docs/en/babel-plugin-transform-typescript#typescript-compiler-options
      // @babel/plugin-transform-typescript 에서 지원되지 않음 -> https://github.com/leonardfactory/babel-plugin-transform-typescript-metadata#readme
      emitDecoratorMetadata: false,

      // https://www.typescriptlang.org/tsconfig#experimentalDecorators
      // @babel/plugin-proposal-decorators + {legacy: true} 설정 필요함
      // Zeroconfig에서 사용되지 않고 있음
      experimentalDecorators: false,

      // https://www.typescriptlang.org/tsconfig#importHelpers
      // @babel/plugin-transform-runtime
      // tsc에서 Compile하지 않고 babel로 넘기기 때문에 큰 의미없다
      importHelpers: false,

      // https://www.typescriptlang.org/tsconfig#inlineSourceMap
      // source file 내부에 source map을 포함함
      // babel에서 통제함 - https://babeljs.io/docs/en/options#sourcemaps
      inlineSourceMap: false,

      // https://www.typescriptlang.org/tsconfig#inlineSources
      // source file 내부에 source map을 포함함
      // babel에서 통제함 - https://babeljs.io/docs/en/options#sourcemaps
      inlineSources: false,

      // https://www.typescriptlang.org/tsconfig#isolatedModules
      // https://babeljs.io/docs/en/babel-plugin-transform-typescript#onlyremovetypeimports
      // babel 기본 동작 false로 세팅 할 수 없다
      isolatedModules: true,

      // https://www.typescriptlang.org/tsconfig#keyofStringsOnly
      // Deprecated - keyof 가 string | number가 아니라 string 으로 동작함
      keyofStringsOnly: false,

      // https://www.typescriptlang.org/tsconfig#mapRoot
      // source map의 http url root를 지정한다
      // 경우에 따라 sentry 등에 사용할 수 있겠지만...
      // babel에서 통제할듯...
      mapRoot: '',

      // https://www.typescriptlang.org/tsconfig#maxNodeModuleJsDepth
      // node_modules 검색 depth를 지정하지만, babel로 넘기기 때문에 의미가 없을듯 싶다
      maxNodeModuleJsDepth: 0,

      // https://www.typescriptlang.org/tsconfig#moduleResolution
      // Deprecated - 입력할 필요없음
      moduleResolution: 'node',

      // https://www.typescriptlang.org/tsconfig#newLine
      // babel이 통제할듯? CRLF, LF를 결정할 수 있지만 babel로 넘기기 때문에 의미 없을듯
      newLine: 'LF',

      // https://www.typescriptlang.org/tsconfig#noEmit
      // Webpack 등에서 통제됨 - js, d.ts 등 파일들을 생성하지 않음
      noEmit: false,

      // https://www.typescriptlang.org/tsconfig#noEmitHelpers
      // async, await, generator 관련 helper function을 내부에 생성하지 않는다
      // babel 로 넘기기 때문에 설정해도 별 영향을 미치지 않을듯 싶다.
      noEmitHelpers: false,

      // https://www.typescriptlang.org/tsconfig#noEmitOnError
      // 모든 error message를 출력하지 않는다
      // 굳이 설정할 필요를 못느낀다.
      noEmitOnError: false,

      // https://www.typescriptlang.org/tsconfig#noErrorTruncation
      // Deprecated - error message turncation 관련 옵션인듯 싶지만... deprecated 되었음
      noErrorTruncation: false,

      // https://www.typescriptlang.org/tsconfig#noImplicitUseStrict
      // 구형 브라우저들에서 최상단 'use strict'를 읽지 못해 모든 함수 내부에 'use strict'를 넣어줌
      // babel에서 처리하기 때문에 의미 없을듯...
      noImplicitUseStrict: false,

      // https://www.typescriptlang.org/tsconfig#noResolve
      // tsc app.ts a.ts --noResolve 상황에서
      // import A from 'a'; // OK
      // import B from 'b'; // Error
      // 와 같이 전달되지 않은 file을 추가하지 않는다
      // Webpack 으로 전달되므로 딱히 의미 없는 옵션일듯...
      noResolve: false,

      // https://www.typescriptlang.org/tsconfig#out
      // Deprecated - Output option
      out: '',

      // https://www.typescriptlang.org/tsconfig#outDir
      // Output Directory
      // Webpack에 의해 통제되므로 의미 없다
      outDir: '',

      // https://www.typescriptlang.org/tsconfig#outFile
      // Output File
      // Webpack에 의해 통제되므로 의미 없다
      outFile: '',

      // https://www.typescriptlang.org/tsconfig#preserveConstEnums
      // https://babeljs.io/docs/en/babel-plugin-transform-typescript#caveats
      // babel 에서 const enum 지원하지 않음
      preserveConstEnums: false,

      // https://www.typescriptlang.org/tsconfig#preserveSymlinks
      // symlink에서 import 시에 기존은 symlink의 원본 경로에서 가져왔었는데, symlink 경로에서 가져옴
      // Webpack -> Babel 로 빌드 되므로 의미 없을듯
      preserveSymlinks: false,

      // https://www.typescriptlang.org/tsconfig#composite
      // https://qiita.com/amay077/items/865b6de860b67ae8d5a7#project-reference-%E9%81%A9%E7%94%A8%E5%BE%8C
      // 다른 tsconfig.json 에서 references로 등록할 수 있게 해준다.
      // 기본값 true
      // Webpack, Babel에 의해서 통제되므로 의미 없을듯
      composite: true,

      // https://www.typescriptlang.org/tsconfig#incremental
      // https://github.com/facebook/create-react-app/issues/6799
      // Babel에 의해서 통제되므로 의미 없을듯
      incremental: false,

      // https://www.typescriptlang.org/tsconfig#tsBuildInfoFile
      // .tsbuildinfo cache 파일 위치?
      // Babel에 의해서 통제되므로 의미 없을듯
      tsBuildInfoFile: '.tsbuildinfo',

      // https://www.typescriptlang.org/tsconfig#removeComments
      // Webpack과 Babel에서 알아서 지워주는듯...
      removeComments: false,

      // https://www.typescriptlang.org/tsconfig#rootDir
      // Webpack에서 동작하지 않을듯
      rootDir: '',

      // https://www.typescriptlang.org/tsconfig#rootDirs
      // Webpack에서 동작하지 않을듯
      rootDirs: [],

      // https://www.typescriptlang.org/tsconfig#skipDefaultLibCheck
      // Deprecated - skipLibCheck를 사용
      skipDefaultLibCheck: false,

      // https://www.typescriptlang.org/tsconfig#sourceMap
      // js.map 파일을 만든다.
      // Babel이 통제하므로 무시된다
      sourceMap: true,

      // https://www.typescriptlang.org/tsconfig#sourceRoot
      // "sourceRoot": "https://my-website.com/debug/source/"
      // -> https://my-website.com/debug/source/index.ts 이렇게 찾게 된다?
      // js.map 파일이 가르키는 실제 source 파일의 위치?
      // Babel에 의해 통제되므로 큰 의미가 없을듯...;;;
      // TODO tsc build에서 테스트해볼 필요가 있을듯 싶은데... 잘 모르겠다.
      sourceRoot: '',
    } as const;

    type Fixed = keyof typeof fixed;

    type Required = keyof typeof required;

    type Optional = keyof typeof optional;

    type Ignored = keyof typeof ignored;

    type EQ<T, S> = [T] extends [S] ? ([S] extends [T] ? true : false) : false;

    type TypeWorkCompleted = EQ<CompilerOptionsKeys, Fixed | Required | Optional | Ignored>;

    const isTypeWorkCompleted: TypeWorkCompleted = true;
  });
});
