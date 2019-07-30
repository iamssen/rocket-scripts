"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getWebpackAlias_1 = require("./webpackConfigs/getWebpackAlias");
const getWebpackMDXLoaders_1 = require("./webpackConfigs/getWebpackMDXLoaders");
const getWebpackScriptLoaders_1 = require("./webpackConfigs/getWebpackScriptLoaders");
const getWebpackStyleLoaders_1 = require("./webpackConfigs/getWebpackStyleLoaders");
const extractCss = false;
function patchStorybookWebpackConfig({ cwd = process.cwd(), config }) {
    process.env.BROWSERSLIST_ENV = 'development';
    config.resolve.extensions.push('.ts', '.tsx');
    config.resolve.alias = {
        ...getWebpackAlias_1.getWebpackAlias({ cwd }),
        ...(config.resolve.alias || {}),
    };
    // https://storybook.js.org/docs/configurations/default-config/
    // https://github.com/storybooks/storybook/blob/next/lib/core/src/server/preview/base-webpack.config.js
    config.module.rules.push({
        oneOf: [
            // ts, tsx, js, jsx - script
            ...getWebpackScriptLoaders_1.getWebpackScriptLoaders({
                cwd,
                useWebWorker: false,
            }),
            // mdx - script
            //...(() => {
            //  const {dependencies, devDependencies}: PackageJson = fs.readJsonSync(path.join(cwd, 'package.json'));
            //
            //  if (((dependencies && dependencies['@storybook/addon-docs']) || (devDependencies && devDependencies['@storybook/addon-docs']))) {
            //    return getWebpackMDXLoaders({
            //      test: /\.(stories|story)\.mdx$/,
            //      cwd,
            //      mdxLoaderOptions: {
            //        compilers: [
            //          require('@storybook/addon-docs/mdx-compiler-plugin')({}),
            //        ],
            //      },
            //    });
            //  }
            //
            //  return [];
            //})(),
            ...getWebpackMDXLoaders_1.getWebpackMDXLoaders({
                cwd,
            }),
            // html, ejs, txt, md - plain text
            //...getWebpackRawLoaders(),
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