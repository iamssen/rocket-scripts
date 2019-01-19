import path from 'path';
import ts, { JsxEmit, ModuleKind, ModuleResolutionKind, Program, ScriptTarget } from 'typescript';
import { Config } from './types';

interface Params {
  file: string;
  appDirectory: Config['appDirectory'];
}

export = function ({file, appDirectory}: Params): Promise<void> {
  const program: Program = ts.createProgram([file], {
    jsx: JsxEmit.React,
    experimentalDecorators: true,
    allowJs: false,
    downlevelIteration: true,
    importHelpers: true,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    
    alwaysStrict: true,
    strictNullChecks: true,
    strictBindCallApply: true,
    strictFunctionTypes: false,
    strictPropertyInitialization: true,
    
    module: ModuleKind.CommonJS,
    target: ScriptTarget.ESNext,
    moduleResolution: ModuleResolutionKind.NodeJs,
    skipLibCheck: true,
    sourceMap: true,
    
    lib: [
      'dom',
      'dom.iterable',
      'esnext',
    ],
    
    typeRoots: [
      path.join(appDirectory, 'node_modules/@types'),
      path.join(appDirectory, 'dist/libs'),
    ],
    //baseUrl:
  });
  
  return new Promise((resolve, reject) => {
  
  });
}