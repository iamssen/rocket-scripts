"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const path_1 = __importDefault(require("path"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
const mirrorFiles_1 = require("../runners/mirrorFiles");
const watchWebpack_1 = require("../runners/watchWebpack");
const sayTitle_1 = require("../utils/sayTitle");
const createWebpackBaseConfig_1 = require("../webpackConfigs/createWebpackBaseConfig");
const createWebpackEnvConfig_1 = require("../webpackConfigs/createWebpackEnvConfig");
const createWebpackWebappConfig_1 = require("../webpackConfigs/createWebpackWebappConfig");
const validateAppDependencies_1 = require("./validateAppDependencies");
async function watchElectron({ cwd, app, zeroconfigPath, staticFileDirectories, output, extend, }) {
    try {
        validateAppDependencies_1.validateAppDependencies({
            projectPackageJson: fs_extra_1.default.readJsonSync(path_1.default.join(cwd, 'package.json')),
            appPackageJson: fs_extra_1.default.readJsonSync(path_1.default.join(cwd, 'src', app, 'package.json')),
        });
    }
    catch (error) {
        sayTitle_1.sayTitle('⚠️ APP PACKAGE.JSON DEPENDENCIES ERROR');
        console.error(error);
        process.exit(1);
    }
    const webpackMainConfig = webpack_merge_1.default(createWebpackBaseConfig_1.createWebpackBaseConfig({ zeroconfigPath }), {
        target: 'electron-main',
        mode: 'development',
        devtool: 'source-map',
        resolve: {
            mainFields: ['main'],
        },
        externals: [webpack_node_externals_1.default({
                whitelist: [
                    // include asset files
                    /\.(?!(?:jsx?|json)$).{1,5}$/i,
                ],
            })],
        entry: {
            main: path_1.default.join(cwd, 'src', app, 'main'),
        },
        output: {
            path: path_1.default.join(output, 'electron'),
            libraryTarget: 'commonjs2',
        },
    }, createWebpackWebappConfig_1.createWebpackWebappConfig({
        extractCss: true,
        cwd,
        chunkPath: '',
        publicPath: '',
        internalEslint: true,
    }), createWebpackEnvConfig_1.createWebpackEnvConfig({
        serverPort: 0,
        publicPath: '',
    }));
    const webpackRendererConfig = webpack_merge_1.default(createWebpackBaseConfig_1.createWebpackBaseConfig({ zeroconfigPath }), {
        target: 'electron-renderer',
        mode: 'development',
        devtool: 'source-map',
        resolve: {
            mainFields: ['main'],
        },
        externals: [webpack_node_externals_1.default({
                whitelist: [
                    // include asset files
                    /\.(?!(?:jsx?|json)$).{1,5}$/i,
                ],
            })],
        entry: {
            renderer: path_1.default.join(cwd, 'src', app, 'renderer'),
        },
        output: {
            path: path_1.default.join(output, 'electron'),
            libraryTarget: 'commonjs2',
        },
        plugins: [
            // create css files
            new mini_css_extract_plugin_1.default({
                filename: `[name].css`,
            }),
            // create html files
            ...(extend.templateFiles.length > 0 ? extend.templateFiles.map(templateFile => {
                const extname = path_1.default.extname(templateFile);
                const filename = path_1.default.basename(templateFile, extname);
                return new html_webpack_plugin_1.default({
                    template: path_1.default.join(cwd, 'src', app, templateFile),
                    filename: filename + '.html',
                    chunks: ['renderer'],
                });
            }) : []),
        ],
    }, createWebpackWebappConfig_1.createWebpackWebappConfig({
        extractCss: true,
        cwd,
        chunkPath: '',
        publicPath: '',
        internalEslint: true,
    }), createWebpackEnvConfig_1.createWebpackEnvConfig({
        serverPort: 0,
        publicPath: '',
    }));
    try {
        sayTitle_1.sayTitle('MIRROR FILES START');
        const watcher = await mirrorFiles_1.mirrorFiles({
            sources: staticFileDirectories,
            output: path_1.default.join(output, 'electron'),
        });
        // mirror files
        watcher.subscribe({
            next: ({ file, treat }) => {
                sayTitle_1.sayTitle('MIRROR FILE');
                console.log(`[${treat}] ${file}`);
            },
            error: error => {
                sayTitle_1.sayTitle('⚠️ MIRROR FILE ERROR');
                console.error(error);
            },
        });
        // watch webpack
        watchWebpack_1.watchWebpack(webpackMainConfig).subscribe({
            next: webpackMessage => {
                sayTitle_1.sayTitle('WATCH ELECTRON MAIN');
                console.log(webpackMessage);
            },
            error: error => {
                sayTitle_1.sayTitle('⚠️ WATCH ELECTRON MAIN ERROR');
                console.error(error);
            },
        });
        // watch webpack
        watchWebpack_1.watchWebpack(webpackRendererConfig).subscribe({
            next: webpackMessage => {
                sayTitle_1.sayTitle('WATCH ELECTRON RENDERER');
                console.log(webpackMessage);
            },
            error: error => {
                sayTitle_1.sayTitle('⚠️ WATCH ELECTRON RENDERER ERROR');
                console.error(error);
            },
        });
    }
    catch (error) {
        sayTitle_1.sayTitle('⚠️ COPY FILES ERROR');
        console.error(error);
    }
}
exports.watchElectron = watchElectron;
//# sourceMappingURL=watchElectron.js.map