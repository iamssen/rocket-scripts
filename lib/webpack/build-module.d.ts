/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
import { Config, ModuleBuildOption } from '../types';
interface Params {
    buildOption: ModuleBuildOption;
    extractCss: boolean;
}
declare const _default: ({ buildOption, extractCss }: Params) => ({ appDirectory }: Config) => Promise<Configuration>;
export = _default;
