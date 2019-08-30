declare type Modules = 'amd' | 'umd' | 'systemjs' | 'commonjs' | 'cjs' | 'auto' | false;
export declare function getBabelConfig({ modules, cwd, targets }: {
    cwd: string;
    modules: Modules;
    targets?: string | string[];
}): object;
export {};
