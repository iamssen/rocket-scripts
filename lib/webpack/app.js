"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fork_ts_checker_webpack_plugin_alt_1 = __importDefault(require("fork-ts-checker-webpack-plugin-alt"));
const typescriptFormatter_1 = __importDefault(require("react-dev-utils/typescriptFormatter"));
const resolve_1 = __importDefault(require("resolve"));
const getAlias_1 = __importDefault(require("../getAlias"));
const webpack_1 = __importDefault(require("webpack"));
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
                                configFile: `${appDirectory}/tslint.json`,
                                tsConfigFile: `${appDirectory}/tsconfig.json`,
                            },
                        },
                    ],
                },
                {
                    oneOf: [
                        // convert files to data url
                        {
                            test: [/\.png$/],
                            include: `${appDirectory}/src`,
                            loader: require.resolve('url-loader'),
                            options: {
                                limit: 10000,
                                name: `${app.buildPath}[name].[ext]`,
                            },
                        },
                        // typescript
                        {
                            test: /\.(ts|tsx)$/,
                            include: `${appDirectory}/src`,
                            loader: require.resolve('ts-loader'),
                            options: {
                                transpileOnly: true,
                            },
                        },
                        {
                            test: /\.svg$/,
                            include: `${appDirectory}/src`,
                            use: [
                                require.resolve('svg-react-loader'),
                            ],
                        },
                        // import text
                        {
                            test: /\.html$/,
                            include: `${appDirectory}/src`,
                            use: [
                                require.resolve('raw-loader'),
                            ],
                        },
                        {
                            test: /\.ejs$/,
                            include: `${appDirectory}/src`,
                            use: [
                                require.resolve('raw-loader'),
                            ],
                        },
                        {
                            test: /\.txt$/,
                            include: `${appDirectory}/src`,
                            use: [
                                require.resolve('raw-loader'),
                            ],
                        },
                        {
                            test: /\.md$/,
                            include: `${appDirectory}/src`,
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
                    basedir: `${appDirectory}/node_modules`,
                }),
                async: false,
                checkSyntacticErrors: true,
                tsconfig: `${appDirectory}/tsconfig.json`,
                reportFiles: [
                    '**',
                    '!**/*.json',
                    '!**/__tests__/**',
                    '!**/?(*.)(spec|test).*',
                    '!**/src/setupProxy.*',
                    '!**/src/setupTests.*',
                ],
                watch: `${appDirectory}/src`,
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