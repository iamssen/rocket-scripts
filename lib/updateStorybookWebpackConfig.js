"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const getDefaultLoaders_1 = __importDefault(require("./utils/webpack/getDefaultLoaders"));
const getStyleLoaders_1 = __importDefault(require("./utils/webpack/getStyleLoaders"));
const appDirectory = process.cwd();
const extractCss = false;
module.exports = ({ config }) => {
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
                    configFile: path_1.default.join(appDirectory, 'tslint.json'),
                    tsConfigFile: path_1.default.join(appDirectory, 'tsconfig.json'),
                },
            },
        ],
    }, {
        oneOf: [
            ...getDefaultLoaders_1.default(path_1.default.join(appDirectory, 'src')),
            ...getStyleLoaders_1.default(/\.css$/, /\.module.css$/, extractCss),
            ...getStyleLoaders_1.default(/\.(scss|sass)$/, /\.module.(scss|sass)$/, extractCss, 'sass-loader'),
            ...getStyleLoaders_1.default(/\.less$/, /\.module.less$/, extractCss, 'less-loader'),
        ],
    });
    return config;
};
//# sourceMappingURL=updateStorybookWebpackConfig.js.map