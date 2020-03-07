"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const getBabelConfig_1 = require("../transpile/getBabelConfig");
function getWebpackMDXLoaders({ test = /\.mdx$/, cwd, mdxLoaderOptions = {}, targets }) {
    const src = path_1.default.join(cwd, 'src');
    const babelLoader = {
        loader: require.resolve('babel-loader'),
        options: {
            cacheDirectory: true,
            cacheCompression: false,
            babelrc: false,
            configFile: false,
            ...getBabelConfig_1.getBabelConfig({
                cwd,
                modules: false,
                targets,
            }),
        },
    };
    return [
        {
            test,
            include: src,
            use: [
                babelLoader,
                {
                    loader: require.resolve('@mdx-js/loader'),
                    options: mdxLoaderOptions,
                },
            ],
        },
    ];
}
exports.getWebpackMDXLoaders = getWebpackMDXLoaders;
//# sourceMappingURL=getWebpackMDXLoaders.js.map