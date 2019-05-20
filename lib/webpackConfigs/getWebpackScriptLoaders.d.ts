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
/** @return RuleSetRule[] for oneOf */
export declare function getWebpackScriptLoaders(params: WorkerUseParams | WorkerUnuseParams): RuleSetRule[];
export {};
