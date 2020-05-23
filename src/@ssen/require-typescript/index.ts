import fs from 'fs';
import Module from 'module';
import path from 'path';
import { ModuleKind, transpileModule, TranspileOutput } from 'typescript';

export function requireTypescript<T>(file: string): T {
  if (!fs.existsSync(file)) {
    throw new Error(`undefined typescript file ${file}`);
  }

  const source: string = fs.readFileSync(file, { encoding: 'utf-8' });

  const result: TranspileOutput = transpileModule(source, {
    compilerOptions: {
      downlevelIteration: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      module: ModuleKind.CommonJS,
      skipLibCheck: true,
    },
  });

  if (result.diagnostics && result.diagnostics.length > 0) {
    console.warn(result.diagnostics);
  }

  //@ts-ignore hidden api
  const paths: string[] = Module._nodeModulePaths(path.dirname(file));
  const parent: Module | null = module.parent;

  const m: Module = new Module(file, parent || undefined);
  m.filename = file;
  m.paths = paths;

  //@ts-ignore hidden api
  m._compile(result.outputText, file);

  return m.exports;
}
