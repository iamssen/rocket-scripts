import path from 'path';
import { CompilerOptions, JsxEmit, ModuleKind, ModuleResolutionKind, ScriptTarget } from 'typescript';
import { createTmpFixture } from '../utils/createTmpFixture';
import { getTSConfigCompilerOptions } from './getTSConfigCompilerOptions';

describe('getTSConfigCompilerOptions', () => {
  // node_modules가 설치되지 않은 상황에서는 extends를 처리할 수 없다

  test('tsconfig CompilerOptions를 가져온다', async () => {
    const cwd: string = await createTmpFixture('custom');
    const compilerOptions: CompilerOptions = getTSConfigCompilerOptions({ cwd });

    expect(compilerOptions).toEqual(
      expect.objectContaining({
        jsx: JsxEmit.React,
        experimentalDecorators: false,
        allowJs: true,
        downlevelIteration: true,
        importHelpers: true,
        resolveJsonModule: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        alwaysStrict: false,
        strictNullChecks: false,
        strictBindCallApply: false,
        strictFunctionTypes: false,
        strictPropertyInitialization: false,
        module: ModuleKind.ESNext,
        target: ScriptTarget.ES5,
        moduleResolution: ModuleResolutionKind.NodeJs,
        skipLibCheck: true,
        sourceMap: true,
        baseUrl: path.join(cwd, 'src'),
        paths: {
          '*': ['_packages/*', '*'],
        },
      } as CompilerOptions),
    );
  });

  test('tsconfig가 없으면 에러가 발생한다', async () => {
    const cwd: string = await createTmpFixture('simple-csr-js');

    expect(() => getTSConfigCompilerOptions({ cwd })).toThrow();
  });
});
