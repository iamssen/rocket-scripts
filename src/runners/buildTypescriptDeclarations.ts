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

interface BuildTypescriptDeclarationsParams {
  file: string;
  name: string;
  compilerOptions: CompilerOptions;
  cwd: string;
  typeRoots: string[];
  declarationDir: string;
}

export async function buildTypescriptDeclarations({file, name, compilerOptions, cwd, typeRoots, declarationDir}: BuildTypescriptDeclarationsParams) {
  const program: Program = createProgram([file], {
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
      ...typeRoots,
    ],
    
    declaration: true,
    emitDeclarationOnly: true,
    
    baseUrl: path.dirname(file),
    declarationDir,
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
    throw new Error(`Build the declaration files of "${name}" is failed`);
  }
}