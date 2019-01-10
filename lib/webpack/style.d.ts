import { Configuration } from 'webpack';
import { Config } from '../types';
interface Params {
    extractCss: boolean;
}
declare const _default: ({ extractCss }: Params) => ({}: Config) => Promise<Configuration>;
export = _default;
