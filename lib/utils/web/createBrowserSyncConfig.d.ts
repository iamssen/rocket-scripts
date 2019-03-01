/// <reference types="webpack-dev-server" />
import { MiddlewareHandler, Options, PerRouteMiddleware } from 'browser-sync';
import webpack from 'webpack';
import { Config } from '../../types';
interface Params {
    app: Config['app'];
    appDirectory: Config['appDirectory'];
    serverEnabled: Config['serverEnabled'];
    middlewares?: (MiddlewareHandler | PerRouteMiddleware)[];
}
declare const _default: ({ app, appDirectory, serverEnabled, middlewares }: Params, webpackConfig: webpack.Configuration) => Promise<Options>;
export = _default;
