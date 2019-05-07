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
  indexFile: string;
  name: string;
  compilerOptions: CompilerOptions;
  cwd: string;
  typeRoots: string[];
  declarationDir: string;
}

export async function buildTypescriptDeclarations({indexFile, name, compilerOptions, cwd, typeRoots, declarationDir}: BuildTypescriptDeclarationsParams) {
  const program: Program = createProgram([indexFile], {
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
    
    baseUrl: path.dirname(indexFile),
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