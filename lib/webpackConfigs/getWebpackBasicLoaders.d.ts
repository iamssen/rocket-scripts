import { RuleSetCondition, RuleSetRule } from 'webpack';
export declare function getWebpackBasicLoaders({ include, babelConfig }: {
    include: RuleSetCondition;
    babelConfig: object;
}): RuleSetRule[];
