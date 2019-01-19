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
const getDefaultLoaders_1 = __importDefault(require("../getDefaultLoaders"));
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
                        ...getDefaultLoaders_1.default(path_1.default.join(appDirectory, 'src')),
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