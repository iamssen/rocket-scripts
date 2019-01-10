"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const getStyleLoaders_1 = __importDefault(require("../getStyleLoaders"));
module.exports = ({ extractCss }) => ({}) => {
    return Promise.resolve({
        module: {
            rules: [
                {
                    oneOf: [
                        ...getStyleLoaders_1.default(/\.css$/, /\.module.css$/, extractCss),
                        ...getStyleLoaders_1.default(/\.(scss|sass)$/, /\.module.(scss|sass)$/, extractCss, 'sass-loader'),
                        ...getStyleLoaders_1.default(/\.less$/, /\.module.less$/, extractCss, 'less-loader'),
                    ],
                },
            ],
        },
    });
};
//# sourceMappingURL=style.js.map