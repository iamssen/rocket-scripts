export declare type Modules = 'amd' | 'umd' | 'systemjs' | 'commonjs' | 'cjs' | 'auto' | false;
export interface Options {
    modules: Modules;
    targets: string | string[];
}
export default function (api: unknown, { modules, targets }: Options): {
    presets: ((string | {
        targets: string | string[];
        ignoreBrowserslistConfig: boolean;
        useBuiltIns: boolean;
        modules: Modules;
        exclude: string[];
    })[] | (string | {
        useBuiltIns: boolean;
    })[])[];
    plugins: (string | (string | {
        loose: boolean;
    })[])[];
};
