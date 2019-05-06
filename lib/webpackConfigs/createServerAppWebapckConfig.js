"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const path_1 = __importDefault(require("path"));
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
function createServerAppWebpackConfig({ cwd, app }) {
    return {
        target: 'node',
        entry: {
            index: path_1.default.join(cwd, 'src', app, 'server'),
        },
        output: {
            libraryTarget: 'commonjs',
        },
        externals: [webpack_node_externals_1.default({
                // include asset files
                whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
            })],
        plugins: [
            new mini_css_extract_plugin_1.default({
                filename: `[name].css`,
            }),
        ],
    };
}
exports.createServerAppWebpackConfig = createServerAppWebpackConfig;
//# sourceMappingURL=createServerAppWebapckConfig.js.map