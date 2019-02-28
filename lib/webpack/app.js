"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fork_ts_checker_webpack_plugin_alt_1 = __importDefault(require("fork-ts-checker-webpack-plugin-alt"));
const path_1 = __importDefault(require("path"));
const typescriptFormatter_1 = __importDefault(require("react-dev-utils/typescriptFormatter"));
const resolve_1 = __importDefault(require("resolve"));
const webpack_1 = __importDefault(require("webpack"));
const getAlias_1 = __importDefault(require("../utils/webpack/getAlias"));
const getDefaultLoaders_1 = __importDefault(require("../utils/webpack/getDefaultLoaders"));
const getStyleLoaders_1 = __importDefault(require("../utils/webpack/getStyleLoaders"));
module.exports = ({ extractCss }) => (config) => {
    const { app, appDirectory, typescriptEnabled } = config;
    const enforce = 'pre';
    const typeScriptPlugins = typescriptEnabled ? [
        new fork_ts_checker_webpack_plugin_alt_1.default({
            typescript: resolve_1.default.sync('typescript', {
                basedir: path_1.default.join(appDirectory, 'node_modules'),
            }),
            async: false,
            checkSyntacticErrors: true,
            tsconfig: path_1.default.join(appDirectory, 'tsconfig.json'),
            reportFiles: [
                '**',
                '!**/*.json',
                '!**/__tests__/**',
                '!**/?(*.)(spec|test).*',
                '!**/src/setupProxy.*',
                '!**/src/setupTests.*',
            ],
            watch: path_1.default.join(appDirectory, 'src'),
            silent: true,
            formatter: typescriptFormatter_1.default,
        }),
    ] : [];
    return Promise.resolve({
        resolve: {
            alias: getAlias_1.default(config),
        },
        module: {
            strictExportPresence: true,
            rules: [
                // tslint
                {
                    test: /\.(ts|tsx)?$/,
                    enforce,
                    use: [
                        {
                            loader: require.resolve('tslint-loader'),
                            options: {
                                configFile: path_1.default.join(appDirectory, 'tslint.json'),
                                tsConfigFile: path_1.default.join(appDirectory, 'tsconfig.json'),
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
                                name: 'static/[name].[hash:8].[ext]',
                            },
                        },
                        ...getDefaultLoaders_1.default(path_1.default.join(appDirectory, 'src')),
                        ...getStyleLoaders_1.default(/\.css$/, /\.module.css$/, extractCss),
                        ...getStyleLoaders_1.default(/\.(scss|sass)$/, /\.module.(scss|sass)$/, extractCss, 'sass-loader'),
                        ...getStyleLoaders_1.default(/\.less$/, /\.module.less$/, extractCss, 'less-loader'),
                        // export files to static directory
                        {
                            loader: require.resolve('file-loader'),
                            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                            options: {
                                name: 'static/[name].[hash:8].[ext]',
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            ...typeScriptPlugins,
            new webpack_1.default.DefinePlugin({
                'process.env.SSR_PORT': JSON.stringify(app.ssrPort),
            }),
        ],
    });
};
//# sourceMappingURL=app.js.map