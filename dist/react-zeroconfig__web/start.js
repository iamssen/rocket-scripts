"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.Start = void 0;
const rule_1 = require("@react-zeroconfig/rule");
const get_port_1 = __importDefault(require("get-port"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const ink_1 = require("ink");
const path_1 = __importDefault(require("path"));
const react_1 = __importStar(require("react"));
const webpack_1 = require("webpack");
const fixChunkPath_1 = require("./rules/fixChunkPath");
const useAppEntry_1 = require("./rules/useAppEntry");
function Start({ cwd, app, outDir, publicPath, chunkPath, staticFileDirectories, externals, port, https, appDir, }) {
    const entry = useAppEntry_1.useAppEntry({ appDir });
    const webpackConfig = react_1.useMemo(() => {
        if (!entry)
            return null;
        const hotMiddleware = path_1.default.dirname(require.resolve('webpack-hot-middleware/package.json'));
        return {
            mode: 'development',
            devtool: 'cheap-module-eval-source-map',
            output: {
                path: cwd,
                publicPath,
                filename: `${chunkPath}[name].js`,
                chunkFilename: `${chunkPath}[name].js`,
                pathinfo: false,
            },
            resolve: {
                extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.mdx'],
                symlinks: false,
            },
            entry: {
                ...entry.reduce((e, { name, index }) => {
                    e[name] = [
                        `${hotMiddleware}/client?path=/__webpack_hmr&timeout=20000&reload=true`,
                        path_1.default.join(cwd, 'src', app, index),
                    ];
                    return e;
                }, {}),
            },
            plugins: [
                new webpack_1.HotModuleReplacementPlugin(),
                new webpack_1.WatchIgnorePlugin([path_1.default.join(cwd, 'node_modules')]),
                // create html files
                ...entry.map(({ html }) => {
                    return new html_webpack_plugin_1.default({
                        template: path_1.default.join(cwd, 'src', app, html),
                        filename: html,
                    });
                }),
            ],
            optimization: {
                removeAvailableModules: false,
                removeEmptyChunks: false,
                splitChunks: false,
                moduleIds: 'named',
                noEmitOnErrors: true,
            },
            // miscellaneous configs
            resolveLoader: {
                modules: ['node_modules'],
            },
            performance: {
                hints: 'warning',
                maxEntrypointSize: 30000000,
                maxAssetSize: 20000000,
            },
            stats: {
                modules: false,
                maxModules: 0,
                errors: true,
                warnings: true,
                children: false,
                moduleTrace: true,
                errorDetails: true,
            },
        };
    }, [app, chunkPath, cwd, entry, publicPath]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(ink_1.Color, null, "Hello?")));
}
exports.Start = Start;
async function start({ cwd, app, outDir: _outDir, publicPath = '', chunkPath: _chunkPath = '', staticFileDirectories: _staticFileDirectories = ['{cwd}/public'], externals = [], port: _port = 'random', https = false, }) {
    const outDir = rule_1.icuFormat(_outDir, { cwd, app });
    const chunkPath = fixChunkPath_1.fixChunkPath(_chunkPath);
    const port = typeof _port === 'number' ? _port : await get_port_1.default({ port: get_port_1.default.makeRange(8000, 9999) });
    const staticFileDirectories = _staticFileDirectories.map((dir) => rule_1.icuFormat(dir, { cwd, app }));
    const appDir = path_1.default.join(cwd, 'src', app);
    ink_1.render(react_1.default.createElement(Start, { cwd: cwd, app: app, outDir: outDir, publicPath: publicPath, chunkPath: chunkPath, staticFileDirectories: staticFileDirectories, externals: externals, port: port, https: https, appDir: appDir }));
}
exports.start = start;
//# sourceMappingURL=start.js.map