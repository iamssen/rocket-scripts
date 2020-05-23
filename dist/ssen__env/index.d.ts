/// <reference types="node" />
export declare const mapEnv: (envFile: string) => (env: NodeJS.ProcessEnv) => NodeJS.ProcessEnv;
export declare const patchEnv: (origin?: NodeJS.ProcessEnv) => (env: NodeJS.ProcessEnv) => void;
export declare const printEnv: (...keys: string[]) => (env: NodeJS.ProcessEnv) => void;
