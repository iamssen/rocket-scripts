import { CompilerOptions } from 'typescript';
interface BuildTypescriptDeclarationsParams {
    file: string;
    name: string;
    compilerOptions: CompilerOptions;
    cwd: string;
    typeRoots: string[];
    declarationDir: string;
}
export declare function buildTypescriptDeclarations({ file, name, compilerOptions, cwd, typeRoots, declarationDir, }: BuildTypescriptDeclarationsParams): Promise<void>;
export {};
