"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const watchWebpack_1 = require("../runners/watchWebpack");
const watingFiles_1 = require("../runners/watingFiles");
const sayTitle_1 = require("../utils/sayTitle");
const createBaseWebpackConfig_1 = require("../webpackConfigs/createBaseWebpackConfig");
const createServerAppWebapckConfig_1 = require("../webpackConfigs/createServerAppWebapckConfig");
const createWebappWebpackConfig_1 = require("../webpackConfigs/createWebappWebpackConfig");
// work
// - [x] wating files for create loadable-stats.json
// - [x] loadable-stats.json to alias to pass to server side rendering
// staticFileDirectories
// - none of effect to this task
// sizeReport
// - none of effect to this task
// mode
// - none of effect to this task
// output
// - [x] output/server
// appFileName
// - none of effect to this task
// vendorFileName
// - none of effect to this task
// styleFileName
// - none of effect to this task
// chunkPath
// - none of effect to this task
// publicPath
// - [x] process.env.PUBLIC_PATH
// port
// - none of effect to this task
// serverPort
// - [x] process.env.SERVER_PORT
// https
// - none of effect to this task
// extend.serverSideRendering
// - none of effect to this task
// extend.templateFiles
// - none of effect to this task
async function watchServer({ app, cwd, serverPort, publicPath, output, zeroconfigPath, }) {
    const loadableStatsJson = path_1.default.join(output, 'loadable-stats.json');
    sayTitle_1.sayTitle('WATING FILES');
    await watingFiles_1.watingFiles([loadableStatsJson]);
    const webpackConfig = webpack_merge_1.default(createBaseWebpackConfig_1.createBaseWebpackConfig({ zeroconfigPath }), {
        target: 'node',
        mode: 'development',
        devtool: 'source-map',
        output: {
            path: path_1.default.join(output, 'server'),
        },
        resolve: {
            alias: {
                'loadable-stats.json': loadableStatsJson,
            },
        },
    }, createWebappWebpackConfig_1.createWebappWebpackConfig({
        extractCss: true,
        cwd,
        serverPort,
        publicPath,
    }), createServerAppWebapckConfig_1.createServerAppWebpackConfig({
        cwd,
        app,
    }));
    // watch webpack
    watchWebpack_1.watchWebpack(webpackConfig).subscribe({
        next: webpackMessage => {
            sayTitle_1.sayTitle('WATCH SERVER');
            console.log(webpackMessage);
        },
        error: error => {
            sayTitle_1.sayTitle('⚠️ WATCH SERVER ERROR');
            console.error(error);
        },
    });
}
exports.watchServer = watchServer;
//# sourceMappingURL=watchServer.js.map