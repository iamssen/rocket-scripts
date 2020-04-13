"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fork_ts_checker_webpack_plugin_1 = __importDefault(require("fork-ts-checker-webpack-plugin"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const resolve_1 = __importDefault(require("resolve"));
const eslintConfigExistsSync_1 = require("./eslintConfigExistsSync");
const getWebpackAlias_1 = require("./getWebpackAlias");
const getWebpackDataURILoaders_1 = require("./getWebpackDataURILoaders");
const getWebpackFileLoaders_1 = require("./getWebpackFileLoaders");
const getWebpackMDXLoaders_1 = require("./getWebpackMDXLoaders");
const getWebpackRawLoaders_1 = require("./getWebpackRawLoaders");
const getWebpackScriptLoaders_1 = require("./getWebpackScriptLoaders");
const getWebpackStyleLoaders_1 = require("./getWebpackStyleLoaders");
const getWebpackYamlLoaders_1 = require("./getWebpackYamlLoaders");
function createWebpackWebappConfig({ extractCss, cwd, chunkPath, publicPath, internalEslint, }) {
    const tsconfig = path_1.default.join(cwd, 'tsconfig.json');
    const tslint = path_1.default.join(cwd, 'tslint.json');
    const eslintConfigExists = eslintConfigExistsSync_1.eslintConfigExistsSync({ cwd });
    return {
        resolve: {
            alias: getWebpackAlias_1.getWebpackAlias({ cwd }),
        },
        module: {
            strictExportPresence: true,
            rules: [
                // tslint
                ...(fs_extra_1.default.pathExistsSync(tsconfig) && fs_extra_1.default.pathExistsSync(tslint)
                    ? [
                        {
                            test: /\.(ts|tsx)$/,
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
                    ]
                    : []),
                // eslint
                ...(() => {
                    if (eslintConfigExists) {
                        return [
                            {
                                test: /\.(js|mjs|jsx|ts|tsx)$/,
                                include: path_1.default.join(cwd, 'src'),
                                enforce: 'pre',
                                use: [
                                    {
                                        loader: require.resolve('eslint-loader'),
                                        options: {
                                            eslintPath: require.resolve('eslint'),
                                            cwd,
                                        },
                                    },
                                ],
                            },
                        ];
                    }
                    else if (internalEslint) {
                        return [
                            {
                                test: /\.(js|mjs|jsx|ts|tsx)$/,
                                include: path_1.default.join(cwd, 'src'),
                                enforce: 'pre',
                                use: [
                                    {
                                        loader: require.resolve('eslint-loader'),
                                        options: {
                                            cache: true,
                                            eslintPath: require.resolve('eslint'),
                                            resolvePluginsRelativeTo: __dirname,
                                            baseConfig: {
                                                extends: [require.resolve('eslint-config-react-app')],
                                            },
                                            ignore: false,
                                            useEslintrc: false,
                                        },
                                    },
                                ],
                            },
                        ];
                    }
                    else {
                        return [];
                    }
                })(),
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
                            chunkPath,
                            publicPath,
                        }),
                        // mdx - script
                        ...getWebpackMDXLoaders_1.getWebpackMDXLoaders({
                            cwd,
                        }),
                        // html, ejs, txt, md - plain text
                        ...getWebpackRawLoaders_1.getWebpackRawLoaders(),
                        // yaml, yml
                        ...getWebpackYamlLoaders_1.getWebpackYamlLoaders(),
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
            ...(fs_extra_1.default.pathExistsSync(tsconfig)
                ? [
                    new fork_ts_checker_webpack_plugin_1.default({
                        typescript: resolve_1.default.sync('typescript', {
                            basedir: path_1.default.join(cwd, 'node_modules'),
                        }),
                        async: false,
                        useTypescriptIncrementalApi: true,
                        checkSyntacticErrors: true,
                        measureCompilationTime: true,
                        tsconfig,
                        reportFiles: [
                            '**',
                            '!**/*.json',
                            '!**/__tests__/**',
                            '!**/?(*.)(spec|test).*',
                            '!**/src/setupProxy.*',
                            '!**/src/setupTests.*',
                        ],
                        silent: true,
                    }),
                ]
                : []),
        ],
        node: {
            module: 'empty',
            dgram: 'empty',
            dns: 'mock',
            fs: 'empty',
            http2: 'empty',
            net: 'empty',
            tls: 'empty',
            child_process: 'empty',
        },
    };
}
exports.createWebpackWebappConfig = createWebpackWebappConfig;
//# sourceMappingURL=createWebpackWebappConfig.js.map