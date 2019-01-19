import { Configuration } from 'webpack';
import { Config, ModuleBuildOption } from '../types';
interface Params {
    buildOption: ModuleBuildOption;
}
declare const _default: ({ buildOption }: Params) => ({ appDirectory }: Config) => Promise<Configuration>;
export = _default;
