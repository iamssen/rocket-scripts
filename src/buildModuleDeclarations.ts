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

// tslint:disable:no-any
function getCompilerOptions(tsconfigPath: string): any {
  const tsconfigText: string = fs.readFileSync(tsconfigPath, {encoding: 'utf8'});
  return ts.parseConfigFileTextToJson(tsconfigPath, tsconfigText).config.compilerOptions;
}

export = function ({buildOption, appDirectory}: Params): Promise<void> {
  if (!buildOption.declaration) return Promise.resolve();
  
  return new Promise((resolve: () => void, reject: (error: Error) => void) => {
    const {
      jsx,
      experimentalDecorators,
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
    } = getCompilerOptions(path.join(appDirectory, 'tsconfig.json'));
    
    const {
      jsx: jsxDefault,
      experimentalDecorators: experimentalDecoratorsDefault,
      downlevelIteration: downlevelIterationDefault,
      importHelpers: importHelpersDefault,
      resolveJsonModule: resolveJsonModuleDefault,
      allowSyntheticDefaultImports: allowSyntheticDefaultImportsDefault,
      esModuleInterop: esModuleInteropDefault,
      alwaysStrict: alwaysStrictDefault,
      strictNullChecks: strictNullChecksDefault,
      strictBindCallApply: strictBindCallApplyDefault,
      strictFunctionTypes: strictFunctionTypesDefault,
      strictPropertyInitialization: strictPropertyInitializationDefault,
      lib: libDefault,
    } = getCompilerOptions(path.join(__dirname, '../configs/tsconfig.json'));
    
    const program: Program = ts.createProgram([buildOption.file], {
      // language setting
      jsx: replaceUndefined(jsx, jsxDefault) ? JsxEmit.React : JsxEmit.None,
      experimentalDecorators: replaceUndefined(experimentalDecorators, experimentalDecoratorsDefault),
      allowJs: false,
      downlevelIteration: replaceUndefined(downlevelIteration, downlevelIterationDefault),
      importHelpers: replaceUndefined(importHelpers, importHelpersDefault),
      allowSyntheticDefaultImports: replaceUndefined(allowSyntheticDefaultImports, allowSyntheticDefaultImportsDefault),
      resolveJsonModule: replaceUndefined(resolveJsonModule, resolveJsonModuleDefault),
      esModuleInterop: replaceUndefined(esModuleInterop, esModuleInteropDefault),
      
      alwaysStrict: replaceUndefined(alwaysStrict, alwaysStrictDefault),
      strictNullChecks: replaceUndefined(strictNullChecks, strictNullChecksDefault),
      strictBindCallApply: replaceUndefined(strictBindCallApply, strictBindCallApplyDefault),
      strictFunctionTypes: replaceUndefined(strictFunctionTypes, strictFunctionTypesDefault),
      strictPropertyInitialization: replaceUndefined(strictPropertyInitialization, strictPropertyInitializationDefault),
      
      module: ModuleKind.CommonJS,
      target: ScriptTarget.ESNext,
      moduleResolution: ModuleResolutionKind.NodeJs,
      skipLibCheck: true,
      sourceMap: false,
      
      lib: replaceUndefined(lib, libDefault).map((l: string) => `lib.${l}.d.ts`),
      
      // declaration setting
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