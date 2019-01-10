"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
module.exports = ({ isProduction }) => ({ app }) => {
    return Promise.resolve({
        plugins: [
            new mini_css_extract_plugin_1.default({
                filename: `[name].css`,
            }),
        ],
    });
};
//# sourceMappingURL=build-ssr.js.map