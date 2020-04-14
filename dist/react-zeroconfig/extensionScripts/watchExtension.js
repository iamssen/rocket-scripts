"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const path_1 = __importDefault(require("path"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const mirrorFiles_1 = require("../runners/mirrorFiles");
const watchWebpack_1 = require("../runners/watchWebpack");
const sayTitle_1 = require("../utils/sayTitle");
const createWebpackBaseConfig_1 = require("../webpackConfigs/createWebpackBaseConfig");
const createWebpackEnvConfig_1 = require("../webpackConfigs/createWebpackEnvConfig");
const createWebpackWebappConfig_1 = require("../webpackConfigs/createWebpackWebappConfig");
async function watchExtension({ cwd, app, zeroconfigPath, staticFileDirectories, output, extend, entryFiles, vendorFileName, styleFileName, }) {
    const webpackConfig = webpack_merge_1.default(createWebpackBaseConfig_1.createWebpackBaseConfig({ zeroconfigPath }), {
        mode: 'development',
        devtool: 'source-map',
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
            moduleIds: 'named',
            //namedModules: true,
            noEmitOnErrors: true,
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
    }), createWebpackEnvConfig_1.createWebpackEnvConfig({
        serverPort: 0,
        publicPath: '',
    }));
    try {
        sayTitle_1.sayTitle('MIRROR FILES START');
        const watcher = await mirrorFiles_1.mirrorFiles({
            sources: staticFileDirectories,
            output: path_1.default.join(output, 'extension'),
        });
        // mirror files
        watcher.subscribe({
            next: ({ file, treat }) => {
                sayTitle_1.sayTitle('MIRROR FILE');
                console.log(`[${treat}] ${file}`);
            },
            error: (error) => {
                sayTitle_1.sayTitle('⚠️ MIRROR FILE ERROR');
                console.error(error);
            },
        });
        // watch webpack
        watchWebpack_1.watchWebpack(webpackConfig).subscribe({
            next: (webpackMessage) => {
                sayTitle_1.sayTitle('WATCH EXTENSION');
                console.log(webpackMessage);
            },
            error: (error) => {
                sayTitle_1.sayTitle('⚠️ WATCH EXTENSION ERROR');
                console.error(error);
            },
        });
    }
    catch (error) {
        sayTitle_1.sayTitle('⚠️ COPY FILES ERROR');
        console.error(error);
    }
}
exports.watchExtension = watchExtension;
//# sourceMappingURL=watchExtension.js.map