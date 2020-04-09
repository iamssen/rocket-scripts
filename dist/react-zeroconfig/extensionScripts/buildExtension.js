"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
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
async function buildExtension({ cwd, app, zeroconfigPath, staticFileDirectories, output, extend, entryFiles, vendorFileName, styleFileName, }) {
    const webpackConfig = webpack_merge_1.default(createWebpackBaseConfig_1.createWebpackBaseConfig({ zeroconfigPath }), {
        mode: 'production',
        output: {
            path: path_1.default.join(output, 'extension'),
            filename: `[name].js`,
            chunkFilename: `[name].js`,
        },
        entry: entryFiles.reduce((entry, entryFile) => {
            const extname = path_1.default.extname(entryFile);
            const filename = path_1.default.basename(entryFile, extname);
            entry[filename] = path_1.default.join(cwd, 'src', app, filename);
            return entry;
        }, {}),
        optimization: {
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
            // create html files
            ...(extend.templateFiles.length > 0
                ? extend.templateFiles.map((templateFile) => {
                    const extname = path_1.default.extname(templateFile);
                    const filename = path_1.default.basename(templateFile, extname);
                    return new html_webpack_plugin_1.default({
                        template: path_1.default.join(cwd, 'src', app, templateFile),
                        filename: filename + '.html',
                        chunks: [filename],
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
        asyncTypeCheck: false,
    }), createWebpackEnvConfig_1.createWebpackEnvConfig({
        serverPort: 0,
        publicPath: '',
    }));
    try {
        sayTitle_1.sayTitle('COPY FILES');
        const copyTo = path_1.default.join(output, 'extension');
        await fs_extra_1.default.mkdirp(copyTo);
        await Promise.all(staticFileDirectories.map((dir) => fs_extra_1.default.copy(dir, copyTo, { dereference: false })));
        // run webpack
        console.log(await runWebpack_1.runWebpack(webpackConfig));
    }
    catch (error) {
        sayTitle_1.sayTitle('⚠️ COPY FILES ERROR');
        console.error(error);
    }
}
exports.buildExtension = buildExtension;
//# sourceMappingURL=buildExtension.js.map