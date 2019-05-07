import { CompilerOptions } from 'typescript';
interface BuildTypescriptDeclarationsParams {
    indexFile: string;
    name: string;
    compilerOptions: CompilerOptions;
    cwd: string;
    typeRoots: string[];
    declarationDir: string;
}
export declare function buildTypescriptDeclarations({ indexFile, name, compilerOptions, cwd, typeRoots, declarationDir }: BuildTypescriptDeclarationsParams): Promise<void>;
export {};
