"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const getBabelConfig_1 = require("./transpile/getBabelConfig");
const getWebpackBasicLoaders_1 = require("./webpackConfigs/getWebpackBasicLoaders");
const getWebpackStyleLoaders_1 = require("./webpackConfigs/getWebpackStyleLoaders");
const extractCss = false;
function patchStorybookWebpackConfig({ cwd = process.cwd(), config }) {
    const tsconfig = path_1.default.join(cwd, 'tsconfig.json');
    const tslint = path_1.default.join(cwd, 'tslint.json');
    config.resolve.extensions.push('.ts', '.tsx');
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
            // html, ejs, txt, md - plain text
            ...getWebpackBasicLoaders_1.getWebpackBasicLoaders({
                include: path_1.default.join(cwd, 'src'),
                babelConfig: getBabelConfig_1.getBabelConfig({
                    cwd,
                    modules: false,
                }),
            }),
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