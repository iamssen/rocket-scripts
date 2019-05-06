"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const path_1 = __importDefault(require("path"));
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
const getWebpackBasicLoaders_1 = require("../webpackUtils/getWebpackBasicLoaders");
const getWebpackStyleLoaders_1 = require("../webpackUtils/getWebpackStyleLoaders");
function createPackageWebpackConfig({ name, cwd, file, externals }) {
    const extractCss = true;
    return {
        entry: () => file,
        externals: [webpack_node_externals_1.default(), ...externals],
        output: {
            path: path_1.default.join(cwd, 'dist/packages', name),
            filename: 'index.js',
            libraryTarget: 'commonjs',
        },
        optimization: {
            concatenateModules: true,
        },
        module: {
            rules: [
                {
                    oneOf: [
                        // ts, tsx, js, jsx - script
                        // html, ejs, txt, md - plain text
                        ...getWebpackBasicLoaders_1.getWebpackBasicLoaders({ include: path_1.default.join(cwd, 'src/_packages', name) }),
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
                },
            ],
        },
        plugins: [
            new mini_css_extract_plugin_1.default({
                filename: 'index.css',
            }),
        ],
    };
}
exports.createPackageWebpackConfig = createPackageWebpackConfig;
//# sourceMappingURL=createPackageWebpackConfig.js.map