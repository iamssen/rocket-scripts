/// <reference types="webpack-dev-server" />
import webpack from 'webpack';
import { Config } from '../types';
interface Params {
    extractCss: boolean;
}
declare const _default: ({ extractCss }: Params) => (config: Config) => Promise<webpack.Configuration>;
export = _default;
