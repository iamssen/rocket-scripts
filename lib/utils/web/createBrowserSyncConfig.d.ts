/// <reference types="webpack-dev-server" />
import { MiddlewareHandler, Options, PerRouteMiddleware } from 'browser-sync';
import webpack from 'webpack';
import { Config } from '../../types';
interface Params {
    app: Config['app'];
    appDirectory: Config['appDirectory'];
    ssrEnabled: Config['ssrEnabled'];
    middlewares?: (MiddlewareHandler | PerRouteMiddleware)[];
}
declare const _default: ({ app, appDirectory, ssrEnabled, middlewares }: Params, webpackConfig: webpack.Configuration) => Promise<Options>;
export = _default;
