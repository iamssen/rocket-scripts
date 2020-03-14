"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getWebpackMDXLoaders_1 = require("./getWebpackMDXLoaders");
const getWebpackRawLoaders_1 = require("./getWebpackRawLoaders");
const getWebpackScriptLoaders_1 = require("./getWebpackScriptLoaders");
const getWebpackStyleLoaders_1 = require("./getWebpackStyleLoaders");
const getWebpackYamlLoaders_1 = require("./getWebpackYamlLoaders");
function createWebpackPackageConfig({ cwd, targets }) {
    const extractCss = true;
    return {
        module: {
            strictExportPresence: true,
            rules: [
                {
                    oneOf: [
                        // ts, tsx, js, jsx - script
                        ...getWebpackScriptLoaders_1.getWebpackScriptLoaders({
                            cwd,
                            targets,
                            useWebWorker: false,
                        }),
                        // mdx - script
                        ...getWebpackMDXLoaders_1.getWebpackMDXLoaders({
                            cwd,
                            targets,
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
                        // every files import by data uri
                        {
                            loader: require.resolve('url-loader'),
                            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.json$/],
                            options: {
                                name: `[name].[hash].[ext]`,
                            },
                        },
                    ],
                },
            ],
        },
    };
}
exports.createWebpackPackageConfig = createWebpackPackageConfig;
//# sourceMappingURL=createWebpackPackageConfig.js.map