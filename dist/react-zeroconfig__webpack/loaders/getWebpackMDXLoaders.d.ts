import { RuleSetCondition, RuleSetRule } from 'webpack';
interface Params {
    test?: RuleSetCondition;
    include: RuleSetCondition;
    babelLoaderOptions: object;
    mdxLoaderOptions?: object;
}
export declare function getWebpackMDXLoaders({ test, include, babelLoaderOptions, mdxLoaderOptions, }: Params): RuleSetRule[];
export {};
