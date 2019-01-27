import fs from 'fs-extra';
import path from 'path';
import ts, {
  Diagnostic,
  EmitResult,
  JsxEmit,
  ModuleKind,
  ModuleResolutionKind,
  Program,
  ScriptTarget,
} from 'typescript';
import { Config, ModuleBuildOption } from './types';

interface Params {
  buildOption: ModuleBuildOption;
  appDirectory: Config['appDirectory'];
}

function replaceUndefined<T>(v: T | undefined, defaultValue: T): T {
  return v === undefined ? defaultValue : v;
}

export = function ({buildOption, appDirectory}: Params): Promise<void> {
  if (!buildOption.declaration) return Promise.resolve();
  
  return new Promise((resolve, reject) => {
    const tsconifg: string = path.join(appDirectory, 'tsconfig.json');
    const tsconfigText: string = fs.readFileSync(tsconifg, {encoding: 'utf8'});
    
    const {config} = ts.parseConfigFileTextToJson(tsconifg, tsconfigText);
    
    const {
      jsx,
      experimentalDecorators,
      allowJs,
      downlevelIteration,
      importHelpers,
      resolveJsonModule,
      allowSyntheticDefaultImports,
      esModuleInterop,
      alwaysStrict,
      strictNullChecks,
      strictBindCallApply,
      strictFunctionTypes,
      strictPropertyInitialization,
      lib,
    } = config.compilerOptions;
    
    const program: Program = ts.createProgram([buildOption.file], {
      jsx: jsx === 'react' ? JsxEmit.React : JsxEmit.None,
      experimentalDecorators: replaceUndefined(experimentalDecorators, true),
      allowJs: replaceUndefined(allowJs, false),
      downlevelIteration: replaceUndefined(downlevelIteration, true),
      importHelpers: replaceUndefined(importHelpers, true),
      allowSyntheticDefaultImports: replaceUndefined(allowSyntheticDefaultImports, true),
      resolveJsonModule: replaceUndefined(resolveJsonModule, true),
      esModuleInterop: replaceUndefined(esModuleInterop, true),
      
      alwaysStrict: replaceUndefined(alwaysStrict, true),
      strictNullChecks: replaceUndefined(strictNullChecks, true),
      strictBindCallApply: replaceUndefined(strictBindCallApply, true),
      strictFunctionTypes: replaceUndefined(strictFunctionTypes, false),
      strictPropertyInitialization: replaceUndefined(strictPropertyInitialization, true),
      
      module: ModuleKind.CommonJS,
      target: ScriptTarget.ESNext,
      moduleResolution: ModuleResolutionKind.NodeJs,
      skipLibCheck: true,
      sourceMap: false,
      
      lib: lib
        ? lib.map(l => `lib.${l}.d.ts`)
        : [
          'lib.dom.d.ts',
          'lib.dom.iterable.d.ts',
          'lib.esnext.d.ts',
        ],
      
      typeRoots: [
        path.join(appDirectory, 'node_modules/@types'),
        path.join(appDirectory, 'dist/modules'),
      ],
      
      declaration: true,
      emitDeclarationOnly: true,
      
      baseUrl: path.join(appDirectory, `src/_modules/${buildOption.name}`),
      declarationDir: path.join(appDirectory, `dist/modules/${buildOption.name}`),
    });
    
    const emitResult: EmitResult = program.emit();
    const diagnostics: Diagnostic[] = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    
    for (const diagnostic of diagnostics) {
      if (diagnostic.file && diagnostic.start) {
        const {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const message: string = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(`🌧 ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
      } else {
        console.log(`🌧 ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
      }
    }
    
    if (emitResult.emitSkipped) {
      reject(new Error(`💀 Build the declaration files of "${buildOption.name}" is failed`));
    } else {
      console.log(`👍 Build the declaration files of "${buildOption.name}" is successful`);
      resolve();
    }
  });
}