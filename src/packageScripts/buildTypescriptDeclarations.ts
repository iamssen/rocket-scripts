import path from 'path';
import {
  CompilerOptions,
  createProgram,
  Diagnostic,
  EmitResult,
  flattenDiagnosticMessageText,
  getPreEmitDiagnostics,
  ModuleKind,
  ModuleResolutionKind,
  Program,
  ScriptTarget,
} from 'typescript';
import { PackageBuildOption } from '../types';

export async function buildTypescriptDeclarations({buildOption, compilerOptions, cwd}: {buildOption: PackageBuildOption, compilerOptions: CompilerOptions, cwd: string}) {
  const program: Program = createProgram([buildOption.file], {
    ...compilerOptions,
    
    allowJs: false,
    module: ModuleKind.CommonJS,
    target: ScriptTarget.ESNext,
    moduleResolution: ModuleResolutionKind.NodeJs,
    skipLibCheck: true,
    sourceMap: false,
    
    typeRoots: [
      ...(compilerOptions.typeRoots || []),
      path.join(cwd, 'node_modules/@types'),
      path.join(cwd, 'dist/packages'),
    ],
    
    declaration: true,
    emitDeclarationOnly: true,
    
    baseUrl: path.dirname(buildOption.file),
    declarationDir: path.join(cwd, 'dist/packages', buildOption.name),
  });
  
  const emitResult: EmitResult = program.emit();
  const diagnostics: Diagnostic[] = getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
  
  for (const diagnostic of diagnostics) {
    if (diagnostic.file && diagnostic.start) {
      const {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
      const message: string = flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
      console.log(`${flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
    }
  }
  
  if (emitResult.emitSkipped) {
    throw new Error(`Build the declaration files of "${buildOption.name}" is failed`);
  }
}