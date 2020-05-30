import fs from 'fs';
import Module from 'module';
import path from 'path';
import { ModuleKind, transpileModule, TranspileOutput } from 'typescript';

export function requireTypescript<T>(file: string): T {
  const fileNames: string[] = [
    file,
    path.join(file + '.js'),
    path.join(file + '.ts'),
    path.join(file, 'index.ts'),
    path.join(file, 'index.js'),
  ];
  const existsFile: string | undefined = fileNames.find(
    (fileName) => fs.existsSync(fileName) && fs.statSync(fileName).isFile(),
  );

  if (!existsFile) {
    throw new Error(`undefined typescript file ${file}`);
  }

  const source: string = fs.readFileSync(existsFile, { encoding: 'utf-8' });

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
  const paths: string[] = Module._nodeModulePaths(path.dirname(existsFile));
  const parent: Module | null = module.parent;

  const m: Module = new Module(existsFile, parent || undefined);
  m.filename = existsFile;
  m.paths = paths;

  //@ts-ignore hidden api
  m._compile(result.outputText, existsFile);

  return m.exports;
}
