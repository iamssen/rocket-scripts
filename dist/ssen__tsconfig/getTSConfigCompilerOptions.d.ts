import { CompilerOptions } from 'typescript';
interface Params {
    cwd: string;
    configName?: string;
}
export declare function getTSConfigCompilerOptions({ cwd, configName }: Params): CompilerOptions;
export {};
