"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const optimize_css_assets_webpack_plugin_1 = __importDefault(require("optimize-css-assets-webpack-plugin"));
const path_1 = __importDefault(require("path"));
const postcss_safe_parser_1 = __importDefault(require("postcss-safe-parser"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const runWebpack_1 = require("../runners/runWebpack");
const sayTitle_1 = require("../utils/sayTitle");
const createWebpackBaseConfig_1 = require("../webpackConfigs/createWebpackBaseConfig");
const createWebpackEnvConfig_1 = require("../webpackConfigs/createWebpackEnvConfig");
const createWebpackWebappConfig_1 = require("../webpackConfigs/createWebpackWebappConfig");
const copyElectronPackageJson_1 = require("./copyElectronPackageJson");
const getRendererExternals_1 = require("./getRendererExternals");
const validateAppDependencies_1 = require("./validateAppDependencies");
async function buildElectron({ cwd, app, zeroconfigPath, staticFileDirectories, output, extend, }) {
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
    const optimization = {
        concatenateModules: true,
        minimize: true,
        minimizer: [
            new terser_webpack_plugin_1.default({
                terserOptions: {
                    ecma: 5,
                    parse: {
                        ecma: 8,
                    },
                    compress: {
                        //ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true,
                    },
                },
                parallel: true,
                cache: true,
                sourceMap: true,
            }),
            new optimize_css_assets_webpack_plugin_1.default({
                cssProcessorOptions: {
                    parser: postcss_safe_parser_1.default,
                    map: {
                        inline: false,
                        annotation: true,
                    },
                },
            }),
        ],
    };
    const webpackMainConfig = webpack_merge_1.default(createWebpackBaseConfig_1.createWebpackBaseConfig({ zeroconfigPath }), {
        target: 'electron-main',
        mode: 'production',
        resolve: {
            mainFields: ['main'],
        },
        externals: ['electron', ...getRendererExternals_1.getRendererExternals({ cwd, app })],
        entry: {
            main: path_1.default.join(cwd, 'src', app, 'main'),
        },
        output: {
            path: path_1.default.join(output, 'electron'),
            libraryTarget: 'commonjs2',
        },
        optimization,
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
        mode: 'production',
        resolve: {
            mainFields: ['main'],
        },
        externals: ['electron', ...getRendererExternals_1.getRendererExternals({ cwd, app })],
        entry: {
            renderer: path_1.default.join(cwd, 'src', app, 'renderer'),
        },
        output: {
            path: path_1.default.join(output, 'electron'),
            libraryTarget: 'commonjs2',
        },
        optimization,
        plugins: [
            // create css files
            new mini_css_extract_plugin_1.default({
                filename: `[name].css`,
            }),
            // TODO bundle analyzer plugin
            // create html files
            ...(extend.templateFiles.length > 0
                ? extend.templateFiles.map((templateFile) => {
                    const extname = path_1.default.extname(templateFile);
                    const filename = path_1.default.basename(templateFile, extname);
                    return new html_webpack_plugin_1.default({
                        template: path_1.default.join(cwd, 'src', app, templateFile),
                        filename: filename + '.html',
                        chunks: ['renderer'],
                    });
                })
                : []),
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
        sayTitle_1.sayTitle('COPY FILES');
        const copyTo = path_1.default.join(output, 'electron');
        await fs_extra_1.default.mkdirp(copyTo);
        await Promise.all(staticFileDirectories.map((dir) => fs_extra_1.default.copy(dir, copyTo, { dereference: false })));
        sayTitle_1.sayTitle('BUILD ELECTRON MAIN');
        console.log(await runWebpack_1.runWebpack(webpackMainConfig));
        sayTitle_1.sayTitle('BUILD ELECTRON RENDERER');
        console.log(await runWebpack_1.runWebpack(webpackRendererConfig));
        sayTitle_1.sayTitle('NPM INSTALL');
        await copyElectronPackageJson_1.copyElectronPackageJson({
            file: path_1.default.join(cwd, 'package.json'),
            app: path_1.default.join(cwd, 'src', app, 'package.json'),
            copyTo: path_1.default.join(output, 'electron/package.json'),
        });
        console.log('BUILD ELECTRON COMPLETED');
        console.log(`Please execute this command below for pack this application:`);
        console.log(chalk_1.default.bold.yellow(`cd ${path_1.default.relative(cwd, path_1.default.join(output, 'electron'))} && npm install && electron-rebuild && electron-builder --mac --win --linux`));
    }
    catch (error) {
        sayTitle_1.sayTitle('⚠️ BUILD ELECTRON ERROR');
        console.error(error);
    }
}
exports.buildElectron = buildElectron;
//# sourceMappingURL=buildElectron.js.map