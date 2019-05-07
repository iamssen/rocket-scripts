"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fork_ts_checker_webpack_plugin_alt_1 = __importDefault(require("fork-ts-checker-webpack-plugin-alt"));
const path_1 = __importDefault(require("path"));
const typescriptFormatter_1 = __importDefault(require("react-dev-utils/typescriptFormatter"));
const resolve_1 = __importDefault(require("resolve"));
const webpack_1 = require("webpack");
const getWebpackAlias_1 = require("./getWebpackAlias");
const getWebpackBasicLoaders_1 = require("./getWebpackBasicLoaders");
const getWebpackStyleLoaders_1 = require("./getWebpackStyleLoaders");
function createWebappWebpackConfig({ extractCss, cwd, serverPort, publicPath }) {
    return {
        resolve: {
            alias: getWebpackAlias_1.getWebpackAlias({ cwd }),
        },
        module: {
            strictExportPresence: true,
            rules: [
                // tslint
                {
                    test: /\.(ts|tsx)?$/,
                    include: path_1.default.join(cwd, 'src'),
                    enforce: 'pre',
                    use: [
                        {
                            loader: require.resolve('tslint-loader'),
                            options: {
                                //eslintPath: require.resolve('eslint'),
                                configFile: path_1.default.join(cwd, 'tslint.json'),
                                tsConfigFile: path_1.default.join(cwd, 'tsconfig.json'),
                            },
                        },
                    ],
                },
                {
                    oneOf: [
                        // convert files to data url
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            loader: require.resolve('url-loader'),
                            options: {
                                limit: 10000,
                                name: `static/[name].[hash].[ext]`,
                            },
                        },
                        // ts, tsx, js, jsx - script
                        // html, ejs, txt, md - plain text
                        ...getWebpackBasicLoaders_1.getWebpackBasicLoaders({ include: path_1.default.join(cwd, 'src') }),
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
                        {
                            loader: require.resolve('file-loader'),
                            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                            options: {
                                name: `static/[name].[hash].[ext]`,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new fork_ts_checker_webpack_plugin_alt_1.default({
                typescript: resolve_1.default.sync('typescript', {
                    basedir: path_1.default.join(cwd, 'node_modules'),
                }),
                async: false,
                checkSyntacticErrors: true,
                tsconfig: path_1.default.join(cwd, 'tsconfig.json'),
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
            new webpack_1.DefinePlugin({
                'process.env.SERVER_PORT': JSON.stringify(serverPort),
                'process.env.PUBLIC_PATH': JSON.stringify(publicPath),
            }),
        ],
    };
}
exports.createWebappWebpackConfig = createWebappWebpackConfig;
//# sourceMappingURL=createWebappWebpackConfig.js.map