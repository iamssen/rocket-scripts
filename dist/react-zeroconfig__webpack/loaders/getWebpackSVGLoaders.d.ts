import { RuleSetCondition, RuleSetRule } from 'webpack';
interface Params {
    test?: RuleSetCondition;
    include: RuleSetCondition;
    babelLoaderOptions: object;
    reactSvgLoaderOptions?: object;
}
export declare function getWebpackSVGLoaders({ test, include, babelLoaderOptions, reactSvgLoaderOptions, }: Params): RuleSetRule[];
export {};
