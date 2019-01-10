import { Configuration } from 'webpack';
import { Config } from '../types';
interface Params {
    isProduction: boolean;
}
declare const _default: ({ isProduction }: Params) => ({ app }: Config) => Promise<Configuration>;
export = _default;
