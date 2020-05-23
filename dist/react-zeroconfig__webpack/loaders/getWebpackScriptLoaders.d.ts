import { RuleSetCondition, RuleSetRule } from 'webpack';
interface WorkerUseParams {
    useWebWorker: true;
    chunkPath: string;
    publicPath: string;
}
interface WorkerUnuseParams {
    useWebWorker: false;
}
declare type Params = (WorkerUseParams | WorkerUnuseParams) & {
    include: RuleSetCondition;
    babelLoaderOptions: object;
};
export declare function getWebpackScriptLoaders(params: Params): RuleSetRule[];
export {};
