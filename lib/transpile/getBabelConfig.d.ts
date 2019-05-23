declare type Modules = 'amd' | 'umd' | 'systemjs' | 'commonjs' | 'cjs' | 'auto' | false;
export declare function getBabelConfig({ modules, cwd }: {
    cwd: string;
    modules: Modules;
}): object;
export {};
