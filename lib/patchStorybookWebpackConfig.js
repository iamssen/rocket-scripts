"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const getWebpackBasicLoaders_1 = require("./webpackUtils/getWebpackBasicLoaders");
const getWebpackStyleLoaders_1 = require("./webpackUtils/getWebpackStyleLoaders");
const extractCss = false;
function patchStorybookWebpackConfig({ cwd = process.cwd(), config }) {
    config.resolve.extensions.push('.ts', '.tsx');
    config.module.rules.push(
    // tslint
    {
        test: /\.(ts|tsx)?$/,
        enforce: 'pre',
        use: [
            {
                loader: require.resolve('tslint-loader'),
                options: {
                    configFile: path_1.default.join(cwd, 'tslint.json'),
                    tsConfigFile: path_1.default.join(cwd, 'tsconfig.json'),
                },
            },
        ],
    }, {
        oneOf: [
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
        ],
    });
    return config;
}
exports.patchStorybookWebpackConfig = patchStorybookWebpackConfig;
//# sourceMappingURL=patchStorybookWebpackConfig.js.map