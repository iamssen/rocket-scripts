import { RuleSetCondition, RuleSetRule } from 'webpack';
export declare function getWebpackMDXLoaders({ test, cwd, mdxLoaderOptions, targets, }: {
    test?: RuleSetCondition;
    cwd: string;
    mdxLoaderOptions?: object;
    targets?: string | string[];
}): RuleSetRule[];
