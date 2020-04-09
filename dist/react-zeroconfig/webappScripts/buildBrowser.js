"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_plugin_1 = __importDefault(require("@loadable/webpack-plugin"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const optimize_css_assets_webpack_plugin_1 = __importDefault(require("optimize-css-assets-webpack-plugin"));
const path_1 = __importDefault(require("path"));
const postcss_safe_parser_1 = __importDefault(require("postcss-safe-parser"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const runWebpack_1 = require("../runners/runWebpack");
const sayTitle_1 = require("../utils/sayTitle");
const createWebpackBaseConfig_1 = require("../webpackConfigs/createWebpackBaseConfig");
const createWebpackEnvConfig_1 = require("../webpackConfigs/createWebpackEnvConfig");
const createWebpackWebappConfig_1 = require("../webpackConfigs/createWebpackWebappConfig");
const getBackdoorWebpackConfig_1 = require("../webpackConfigs/getBackdoorWebpackConfig");
async function buildBrowser({ mode, sourceMap, output, app, cwd, serverPort, staticFileDirectories, chunkPath, publicPath, internalEslint, appFileName, vendorFileName, styleFileName, sizeReport, extend, zeroconfigPath, }) {
    const webpackConfig = webpack_merge_1.default(getBackdoorWebpackConfig_1.getBackdoorWebpackConfig({ cwd }), createWebpackBaseConfig_1.createWebpackBaseConfig({ zeroconfigPath }), {
        mode,
        //devtool: mode === 'production' ? false : 'source-map',
        devtool: typeof sourceMap === 'boolean'
            ? sourceMap
                ? 'source-map'
                : false
            : mode === 'production'
                ? false
                : 'source-map',
        entry: {
            [appFileName]: path_1.default.join(cwd, 'src', app),
        },
        output: {
            path: path_1.default.join(output, 'browser'),
            filename: `${chunkPath}[name].[hash].js`,
            chunkFilename: `${chunkPath}[name].[hash].js`,
            publicPath,
        },
        optimization: {
            concatenateModules: mode === 'production',
            minimize: mode === 'production',
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
                        map: mode === 'production'
                            ? {
                                inline: false,
                                annotation: true,
                            }
                            : false,
                    },
                }),
            ],
            splitChunks: {
                cacheGroups: {
                    // vendor chunk
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: vendorFileName,
                        chunks: 'all',
                    },
                    // extract single css file
                    style: {
                        test: (m) => m.constructor.name === 'CssModule',
                        name: styleFileName,
                        chunks: 'all',
                        enforce: true,
                    },
                },
            },
        },
        plugins: [
            // create css files
            new mini_css_extract_plugin_1.default({
                filename: `${chunkPath}[name].[hash].css`,
                chunkFilename: `${chunkPath}[name].[hash].css`,
            }),
            // create size report
            new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: path_1.default.join(output, 'size-report.html'),
                openAnalyzer: sizeReport,
            }),
            // create loadable-stats.json when server side rendering is enabled
            ...(extend.serverSideRendering
                ? [
                    new webpack_plugin_1.default({
                        filename: '../loadable-stats.json',
                        writeToDisk: true,
                    }),
                ]
                : []),
            // create html files
            ...(extend.templateFiles.length > 0
                ? extend.templateFiles.map((templateFile) => {
                    const extname = path_1.default.extname(templateFile);
                    const filename = path_1.default.basename(templateFile, extname);
                    return new html_webpack_plugin_1.default({
                        template: path_1.default.join(cwd, 'src', app, templateFile),
                        filename: filename + '.html',
                    });
                })
                : []),
        ],
    }, createWebpackWebappConfig_1.createWebpackWebappConfig({
        extractCss: true,
        cwd,
        chunkPath,
        publicPath,
        internalEslint,
        asyncTypeCheck: false,
    }), createWebpackEnvConfig_1.createWebpackEnvConfig({
        serverPort,
        publicPath,
    }));
    try {
        sayTitle_1.sayTitle('BUILD BROWSER');
        // create output directory if not exists for loadable-stats.json
        if (extend.serverSideRendering)
            await fs_extra_1.default.mkdirp(path_1.default.join(output));
        // copy static file directories
        const copyTo = path_1.default.join(output, 'browser');
        await fs_extra_1.default.mkdirp(copyTo);
        await Promise.all(staticFileDirectories.map((dir) => fs_extra_1.default.copy(dir, copyTo, { dereference: true })));
        // run webpack
        console.log(await runWebpack_1.runWebpack(webpackConfig));
    }
    catch (error) {
        sayTitle_1.sayTitle('⚠️ BUILD BROWSER ERROR');
        console.error(error);
    }
}
exports.buildBrowser = buildBrowser;
//# sourceMappingURL=buildBrowser.js.map