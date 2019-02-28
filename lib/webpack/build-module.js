"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const path_1 = __importDefault(require("path"));
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
const getDefaultLoaders_1 = __importDefault(require("../utils/webpack/getDefaultLoaders"));
const getStyleLoaders_1 = __importDefault(require("../utils/webpack/getStyleLoaders"));
module.exports = ({ buildOption, extractCss }) => ({ appDirectory }) => {
    const libraryTarget = 'commonjs';
    return Promise.resolve({
        entry: () => buildOption.file,
        externals: [webpack_node_externals_1.default(), ...buildOption.externals],
        output: {
            path: path_1.default.join(appDirectory, `dist/modules/${buildOption.name}`),
            filename: 'index.js',
            libraryTarget,
        },
        optimization: {
            concatenateModules: true,
        },
        module: {
            rules: [
                {
                    oneOf: [
                        //// convert files to data url
                        //{
                        //  test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        //  loader: require.resolve('url-loader'),
                        //  options: {
                        //    limit: 10000,
                        //    name: 'public/[name].[hash:8].[ext]',
                        //  },
                        //},
                        ...getDefaultLoaders_1.default(path_1.default.join(appDirectory, `src/_modules/${buildOption.name}`)),
                        ...getStyleLoaders_1.default(/\.css$/, /\.module.css$/, extractCss),
                        ...getStyleLoaders_1.default(/\.(scss|sass)$/, /\.module.(scss|sass)$/, extractCss, 'sass-loader'),
                        ...getStyleLoaders_1.default(/\.less$/, /\.module.less$/, extractCss, 'less-loader'),
                    ],
                },
            ],
        },
        plugins: [
            new mini_css_extract_plugin_1.default({
                filename: 'index.css',
            }),
        ],
    });
};
//# sourceMappingURL=build-module.js.map