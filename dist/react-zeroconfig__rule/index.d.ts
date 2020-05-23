/// <reference types="node" />
export interface CommandParams {
    cwd: string;
    env: NodeJS.ProcessEnv;
    commands: string[];
}
export declare function parseNumber(source: unknown): number | undefined;
export declare function icuFormat(text: string, vars: Record<string, string | number>): string;
