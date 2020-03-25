import { RuleSetRule } from 'webpack';
interface WorkerUseParams {
    cwd: string;
    useWebWorker: true;
    chunkPath: string;
    publicPath: string;
}
interface WorkerUnuseParams {
    cwd: string;
    useWebWorker: false;
}
declare type Params = (WorkerUseParams | WorkerUnuseParams) & {
    targets?: string | string[];
};
/** @return RuleSetRule[] for oneOf */
export declare function getWebpackScriptLoaders(params: Params): RuleSetRule[];
export {};
