import { CompilerOptions } from 'typescript';
import { PackageBuildOption } from '../types';
export declare function buildTypescriptDeclarations({ buildOption, compilerOptions, cwd }: {
    buildOption: PackageBuildOption;
    compilerOptions: CompilerOptions;
    cwd: string;
}): Promise<void>;
