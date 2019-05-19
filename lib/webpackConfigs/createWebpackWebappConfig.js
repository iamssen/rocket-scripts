"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fork_ts_checker_webpack_plugin_alt_1 = __importDefault(require("fork-ts-checker-webpack-plugin-alt"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const typescriptFormatter_1 = __importDefault(require("react-dev-utils/typescriptFormatter"));
const resolve_1 = __importDefault(require("resolve"));
const getWebpackAlias_1 = require("./getWebpackAlias");
const getWebpackDataURILoaders_1 = require("./getWebpackDataURILoaders");
const getWebpackFileLoaders_1 = require("./getWebpackFileLoaders");
const getWebpackRawLoaders_1 = require("./getWebpackRawLoaders");
const getWebpackScriptLoaders_1 = require("./getWebpackScriptLoaders");
const getWebpackStyleLoaders_1 = require("./getWebpackStyleLoaders");
function createWebpackWebappConfig({ extractCss, cwd, chunkPath }) {
    const tsconfig = path_1.default.join(cwd, 'tsconfig.json');
    const tslint = path_1.default.join(cwd, 'tslint.json');
    return {
        resolve: {
            alias: getWebpackAlias_1.getWebpackAlias({ cwd }),
        },
        module: {
            strictExportPresence: true,
            rules: [
                // tslint
                ...(fs_extra_1.default.pathExistsSync(tsconfig) && fs_extra_1.default.pathExistsSync(tslint) ? [
                    {
                        test: /\.(ts|tsx)?$/,
                        include: path_1.default.join(cwd, 'src'),
                        enforce: 'pre',
                        use: [
                            {
                                loader: require.resolve('tslint-loader'),
                                options: {
                                    configFile: tslint,
                                    tsConfigFile: tsconfig,
                                },
                            },
                        ],
                    },
                ] : []),
                {
                    oneOf: [
                        // convert files to data url
                        ...getWebpackDataURILoaders_1.getWebpackDataURILoaders({
                            chunkPath,
                        }),
                        // ts, tsx, js, jsx - script
                        ...getWebpackScriptLoaders_1.getWebpackScriptLoaders({
                            cwd,
                            useWebWorker: true,
                        }),
                        // html, ejs, txt, md - plain text
                        ...getWebpackRawLoaders_1.getWebpackRawLoaders(),
                        // css, scss, sass, less - style
                        // module.* - css module
                        ...getWebpackStyleLoaders_1.getWebpackStyleLoaders({
                            cssRegex: /\.css$/,
                            cssModuleRegex: /\.module.css$/,
                            extractCss,
                        }),
                        ...getWebpackStyleLoaders_1.getWebpackStyleLoaders({
                            cssRegex: /\.(scss|sass)$/,
                            cssModuleRegex: /\.module.(scss|sass)$/,
                            extractCss,
                            preProcessor: 'sass-loader',
                        }),
                        ...getWebpackStyleLoaders_1.getWebpackStyleLoaders({
                            cssRegex: /\.less$/,
                            cssModuleRegex: /\.module.less$/,
                            extractCss,
                            preProcessor: 'less-loader',
                        }),
                        // export files to static directory
                        ...getWebpackFileLoaders_1.getWebpackFileLoaders({
                            chunkPath,
                        }),
                    ],
                },
            ],
        },
        plugins: [
            ...(fs_extra_1.default.pathExistsSync(tsconfig) ? [
                new fork_ts_checker_webpack_plugin_alt_1.default({
                    typescript: resolve_1.default.sync('typescript', {
                        basedir: path_1.default.join(cwd, 'node_modules'),
                    }),
                    async: false,
                    checkSyntacticErrors: true,
                    tsconfig,
                    reportFiles: [
                        '**',
                        '!**/*.json',
                        '!**/__tests__/**',
                        '!**/?(*.)(spec|test).*',
                        '!**/src/setupProxy.*',
                        '!**/src/setupTests.*',
                    ],
                    watch: path_1.default.join(cwd, 'src'),
                    silent: true,
                    formatter: typescriptFormatter_1.default,
                }),
            ] : []),
        ],
    };
}
exports.createWebpackWebappConfig = createWebpackWebappConfig;
//# sourceMappingURL=createWebpackWebappConfig.js.map