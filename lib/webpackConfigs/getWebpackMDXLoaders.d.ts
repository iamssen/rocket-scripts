import { RuleSetCondition, RuleSetRule } from 'webpack';
export declare function getWebpackMDXLoaders({ test, cwd, mdxLoaderOptions }: {
    test?: RuleSetCondition;
    cwd: string;
    mdxLoaderOptions?: object;
}): RuleSetRule[];
