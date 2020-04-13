"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const path_1 = __importDefault(require("path"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
const watchWebpack_1 = require("../runners/watchWebpack");
const watingFiles_1 = require("../runners/watingFiles");
const sayTitle_1 = require("../utils/sayTitle");
const createWebpackBaseConfig_1 = require("../webpackConfigs/createWebpackBaseConfig");
const createWebpackWebappConfig_1 = require("../webpackConfigs/createWebpackWebappConfig");
const createWebpackEnvConfig_1 = require("../webpackConfigs/createWebpackEnvConfig");
async function watchServer({ app, cwd, serverPort, publicPath, internalEslint, output, chunkPath, zeroconfigPath, }) {
    const loadableStatsJson = path_1.default.join(output, 'loadable-stats.json');
    sayTitle_1.sayTitle('WATING FILES');
    await watingFiles_1.watingFiles([loadableStatsJson]);
    const webpackConfig = webpack_merge_1.default(createWebpackBaseConfig_1.createWebpackBaseConfig({ zeroconfigPath }), {
        target: 'node',
        mode: 'development',
        devtool: 'source-map',
        entry: {
            index: path_1.default.join(cwd, 'src', app, 'server'),
        },
        output: {
            path: path_1.default.join(output, 'server'),
            libraryTarget: 'commonjs',
        },
        resolve: {
            alias: {
                'loadable-stats.json': loadableStatsJson,
                '@loadable/stats.json': loadableStatsJson,
            },
        },
        externals: [
            webpack_node_externals_1.default({
                // include asset files
                whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
            }),
        ],
        plugins: [
            new mini_css_extract_plugin_1.default({
                filename: `[name].css`,
            }),
        ],
    }, createWebpackWebappConfig_1.createWebpackWebappConfig({
        extractCss: true,
        cwd,
        chunkPath,
        publicPath,
        internalEslint,
    }), createWebpackEnvConfig_1.createWebpackEnvConfig({
        serverPort,
        publicPath,
    }));
    // watch webpack
    watchWebpack_1.watchWebpack(webpackConfig).subscribe({
        next: (webpackMessage) => {
            sayTitle_1.sayTitle('WATCH SERVER');
            console.log(webpackMessage);
        },
        error: (error) => {
            sayTitle_1.sayTitle('⚠️ WATCH SERVER ERROR');
            console.error(error);
        },
    });
}
exports.watchServer = watchServer;
//# sourceMappingURL=watchServer.js.map