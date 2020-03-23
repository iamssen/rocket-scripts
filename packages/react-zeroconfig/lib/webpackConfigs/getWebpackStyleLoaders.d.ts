import { RuleSetRule } from 'webpack';
interface GetWebpackStyleLoadersParameters {
    cssRegex: RegExp;
    cssModuleRegex: RegExp;
    extractCss: boolean;
    preProcessor?: string;
}
/** @return RuleSetRule[] for oneOf */
export declare function getWebpackStyleLoaders({ cssRegex, cssModuleRegex, extractCss, preProcessor, }: GetWebpackStyleLoadersParameters): RuleSetRule[];
export {};
