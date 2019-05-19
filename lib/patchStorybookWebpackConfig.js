"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const getWebpackRawLoaders_1 = require("./webpackConfigs/getWebpackRawLoaders");
const getWebpackScriptLoaders_1 = require("./webpackConfigs/getWebpackScriptLoaders");
const getWebpackStyleLoaders_1 = require("./webpackConfigs/getWebpackStyleLoaders");
const extractCss = false;
function patchStorybookWebpackConfig({ cwd = process.cwd(), config }) {
    const tsconfig = path_1.default.join(cwd, 'tsconfig.json');
    const tslint = path_1.default.join(cwd, 'tslint.json');
    config.resolve.extensions.push('.ts', '.tsx');
    // https://storybook.js.org/docs/configurations/default-config/
    // https://github.com/storybooks/storybook/blob/next/lib/core/src/server/preview/base-webpack.config.js
    config.module.rules.push(
    // tslint
    ...(fs_extra_1.default.pathExistsSync(tsconfig) && fs_extra_1.default.pathExistsSync(tslint) ? [
        {
            test: /\.(ts|tsx)?$/,
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
    ] : []), {
        oneOf: [
            // ts, tsx, js, jsx - script
            ...getWebpackScriptLoaders_1.getWebpackScriptLoaders({
                cwd,
                useWebWorker: false,
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
        ],
    });
    return config;
}
exports.patchStorybookWebpackConfig = patchStorybookWebpackConfig;
//# sourceMappingURL=patchStorybookWebpackConfig.js.map