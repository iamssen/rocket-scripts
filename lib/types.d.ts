import { Configuration } from 'webpack';
export interface ModuleBuildOption {
    name: string;
    file: string;
    declaration: boolean;
    externals: string[];
}
export interface ModulePublishOption {
    name: string;
    workingVersion: string;
    remoteVersion: string | undefined;
}
export interface Config {
    app: {
        entry: string[];
        port: number;
        staticFileDirectories: string[];
        buildPath: string;
        https: boolean | {
            key: string;
            cert: string;
        };
        vendorFileName: string;
        styleFileName: string;
        publicPath: string;
        ssrPort: number;
    };
    modules: {
        entry: string[];
    };
    command: string;
    appDirectory: string;
    zeroconfigDirectory: string;
    ssrEnabled: boolean;
}
export declare type UserConfig = Partial<Config>;
export declare type WebpackFunction = (config: Config) => Promise<Configuration>;
export declare type TranslationType = 'i18next' | 'intl';
export declare type TranslationNode = string | {
    [key: string]: TranslationNode;
};
export declare type TranslationContent = {
    [key: string]: TranslationNode;
};
export declare type TranslationStore = Map<string, Map<string, TranslationContent>>;
