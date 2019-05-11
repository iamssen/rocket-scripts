"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const path_1 = __importDefault(require("path"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
const copyServerPackageJson_1 = require("../runners/copyServerPackageJson");
const runWebpack_1 = require("../runners/runWebpack");
const sayTitle_1 = require("../utils/sayTitle");
const createBaseWebpackConfig_1 = require("../webpackConfigs/createBaseWebpackConfig");
const createWebappWebpackConfig_1 = require("../webpackConfigs/createWebappWebpackConfig");
// work
// - [x] works after buildBrowser
// - [x] require exists file loadable-stats.json
// - [x] loadable-stats.json to alias to pass to server side rendering
// - [x] copy package.json to output/server
// staticFileDirectories
// - none of effect to this task
// sizeReport
// - none of effect to this task
// mode
// - [x] mode, devtool
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
async function buildServer({ app, mode, cwd, output, publicPath, serverPort, zeroconfigPath, }) {
    const loadableStatsJson = path_1.default.join(output, 'loadable-stats.json');
    if (![loadableStatsJson].every(fs_extra_1.default.pathExistsSync)) {
        throw new Error(`Required file ${loadableStatsJson}`);
    }
    const webpackConfig = webpack_merge_1.default(createBaseWebpackConfig_1.createBaseWebpackConfig({ zeroconfigPath }), {
        target: 'node',
        mode,
        devtool: mode === 'production' ? false : 'source-map',
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
            },
        },
        externals: [webpack_node_externals_1.default({
                // include asset files
                whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
            })],
        plugins: [
            new mini_css_extract_plugin_1.default({
                filename: `[name].css`,
            }),
        ],
    }, createWebappWebpackConfig_1.createWebappWebpackConfig({
        extractCss: true,
        cwd,
        serverPort,
        publicPath,
    }));
    try {
        sayTitle_1.sayTitle('BUILD SERVER');
        // run webpack
        console.log(await runWebpack_1.runWebpack(webpackConfig));
        // copy package.json
        await copyServerPackageJson_1.copyServerPackageJson({
            file: path_1.default.join(cwd, 'package.json'),
            copyTo: path_1.default.join(output, 'server/package.json'),
        });
    }
    catch (error) {
        sayTitle_1.sayTitle('⚠️ BUILD SERVER ERROR');
        console.error(error);
    }
}
exports.buildServer = buildServer;
//# sourceMappingURL=buildServer.js.map