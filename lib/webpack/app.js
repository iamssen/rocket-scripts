"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fork_ts_checker_webpack_plugin_alt_1 = __importDefault(require("fork-ts-checker-webpack-plugin-alt"));
const path_1 = __importDefault(require("path"));
const typescriptFormatter_1 = __importDefault(require("react-dev-utils/typescriptFormatter"));
const resolve_1 = __importDefault(require("resolve"));
const webpack_1 = __importDefault(require("webpack"));
const getAlias_1 = __importDefault(require("../getAlias"));
module.exports = () => (config) => {
    const { app, appDirectory } = config;
    const enforce = 'pre';
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
                            test: [/\.png$/],
                            include: path_1.default.join(appDirectory, 'src'),
                            loader: require.resolve('url-loader'),
                            options: {
                                limit: 10000,
                                name: `${app.buildPath}[name].[ext]`,
                            },
                        },
                        // babel
                        {
                            test: /\.(ts|tsx|jsx)$/,
                            include: path_1.default.join(appDirectory, 'src'),
                            loader: require.resolve('babel-loader'),
                            options: {
                                babelrc: false,
                                configFile: false,
                                presets: [
                                    [
                                        require.resolve('@babel/preset-env'),
                                        {
                                            targets: {
                                                ie: 9,
                                            },
                                            ignoreBrowserslistConfig: true,
                                            useBuiltIns: false,
                                            modules: false,
                                            exclude: ['transform-typeof-symbol'],
                                        },
                                    ],
                                    [
                                        require.resolve('@babel/preset-react'),
                                        {
                                            useBuiltIns: true,
                                        },
                                    ],
                                    require.resolve('@babel/preset-typescript'),
                                ],
                                plugins: [
                                    require.resolve('@babel/plugin-transform-destructuring'),
                                    [
                                        require.resolve('@babel/plugin-proposal-decorators'),
                                        {
                                            legacy: false,
                                            decoratorsBeforeExport: true,
                                        },
                                    ],
                                    [
                                        require.resolve('@babel/plugin-proposal-class-properties'),
                                        {
                                            loose: true,
                                        },
                                    ],
                                    [
                                        require.resolve('@babel/plugin-proposal-object-rest-spread'),
                                        {
                                            useBuiltIns: true,
                                        },
                                    ],
                                    require.resolve('babel-plugin-dynamic-import-webpack'),
                                ],
                                overrides: [
                                    {
                                        test: /\.(ts|tsx)$/,
                                        plugins: [
                                            [
                                                require.resolve('@babel/plugin-proposal-decorators'),
                                                {
                                                    legacy: true,
                                                },
                                            ],
                                        ],
                                    },
                                ],
                            },
                        },
                        {
                            test: /\.svg$/,
                            include: path_1.default.join(appDirectory, 'src'),
                            use: [
                                require.resolve('svg-react-loader'),
                            ],
                        },
                        // import text
                        {
                            test: /\.html$/,
                            include: path_1.default.join(appDirectory, 'src'),
                            use: [
                                require.resolve('raw-loader'),
                            ],
                        },
                        {
                            test: /\.ejs$/,
                            include: path_1.default.join(appDirectory, 'src'),
                            use: [
                                require.resolve('raw-loader'),
                            ],
                        },
                        {
                            test: /\.txt$/,
                            include: path_1.default.join(appDirectory, 'src'),
                            use: [
                                require.resolve('raw-loader'),
                            ],
                        },
                        {
                            test: /\.md$/,
                            include: path_1.default.join(appDirectory, 'src'),
                            use: [
                                require.resolve('raw-loader'),
                                require.resolve('markdown-loader'),
                            ],
                        },
                    ],
                },
            ],
        },
        plugins: [
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
            new webpack_1.default.DefinePlugin({
                'process.env.SSR_PORT': JSON.stringify(app.ssrPort),
            }),
        ],
    });
};
//# sourceMappingURL=app.js.map