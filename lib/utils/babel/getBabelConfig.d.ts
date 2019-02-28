interface Params {
    modules: 'commonjs' | false;
}
declare const _default: ({ modules }: Params) => {
    presets: (string | (string | {
        targets: {
            ie: number;
        };
        ignoreBrowserslistConfig: boolean;
        useBuiltIns: boolean;
        modules: false | "commonjs";
        exclude: string[];
    })[] | (string | {
        useBuiltIns: boolean;
    })[])[];
    plugins: (string | (string | {
        legacy: boolean;
        decoratorsBeforeExport: boolean;
    })[] | (string | {
        loose: boolean;
    })[] | (string | {
        useBuiltIns: boolean;
    })[] | (string | {
        loaderMap: {
            svg: {
                ReactComponent: string;
            };
        };
    })[] | (string | {
        libraryName: string;
    })[])[];
    overrides: {
        test: RegExp;
        plugins: (string | {
            legacy: boolean;
        })[][];
    }[];
};
export = _default;
